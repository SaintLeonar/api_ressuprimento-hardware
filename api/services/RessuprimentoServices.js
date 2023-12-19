const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')
const { parse, isValid, isBefore, startOfDay } = require('date-fns');
const ProdutoServices = require('./ProdutoServices')
const ItemPedidoFornecedorServices = require('./ItemPedidoFornecedorServices')
const FornecedorServices = require('./FornecedorServices')
const DepositoServices = require('./DepositoServices')
const PagamentoRessuprimentoServices = require('./PagamentoRessuprimentoServices')
const TransportadoraInternacionalServices = require('./TransportadoraInternacionalServices')
const TransportadoraLocalServices = require('./TransportadoraLocalServices')
const AlfandegaInternacionalServices = require('./AlfandegaInternacionalServices')
const AlfandegaNacionalServices = require('./AlfandegaNacionalServices')
const NotaFiscalServices = require('./NotaFiscalServices')

class RessuprimentoServices extends Services {
    constructor() {
        super('Pedido_Ressuprimento')
        this.produtos = new ProdutoServices()
        this.itemPedidoFornecedor = new ItemPedidoFornecedorServices()
        this.fornecedor = new FornecedorServices()
        this.deposito = new DepositoServices()
        this.pagamento = new PagamentoRessuprimentoServices()
        this.transportadoraInternacional = new TransportadoraInternacionalServices()
        this.transportadoraLocal = new TransportadoraLocalServices()
        this.alfandegaInternacional = new AlfandegaInternacionalServices()
        this.alfandegaNacional = new AlfandegaNacionalServices()
        this.notaFiscal = new NotaFiscalServices()
    }

    async criaNovoPedidoRessuprimento(pFornecedorId, pDepositoId, pProdutos, pTransacao) {

        const fornecedor = await this.fornecedor.buscaUmRegistro(pFornecedorId)
        if(!fornecedor) {
            throw new Erro(404, 'Fornecedor não encontrado na base')
        }
        const deposito = await this.deposito.buscaUmRegistro(pDepositoId)
        if(!deposito) {
            throw new Erro(404, 'Depósito não encontrado na base')
        }

        // CRIA UM NOVO REGISTRO DE PEDIDO DE RESSUPRIMENTO
        const novoPedido = await database[this.nomeDoModelo].create(
            {
                data_pedido: startOfDay(new Date()),
                fornecedor_id: pFornecedorId,
                deposito_id: pDepositoId
            },
            { transaction: pTransacao }
        )

        // Caberia aqui testar se a lista de produtos está vazia.
        if(!pProdutos) {
            throw new Erro(404, 'Lista de produtos está vazia')
        }

        // ITERA SOBRE OS PRODUTOS
        for(const produtoInfo of pProdutos) {
            const { ean, quantidade_pedida, preco_acordado } = produtoInfo;

            // BUSCA PELO PRODUTO COM O EAN INFORMADO
            const produto = await this.produtos.buscaProduto(ean)
            if(!produto) {
                throw new Erro(404, 'EAN não encontrado na base')
            }
            
            // CRIA UM NOVO ITEM_PEDIDO_FORNECEDOR
            await this.itemPedidoFornecedor.criaItemPedidoFornecedor(quantidade_pedida, preco_acordado, produto.id, novoPedido.id, pTransacao)
        }

        return novoPedido
    }

    async aceitaPedidoRessuprimento(pId, pAceito, pTransacao) {
        if (typeof pAceito !== 'boolean') {
            throw new Erro(400, 'Valor inválido. Valores esperados: true | false')
        }

        const pedido = await this.buscaUmRegistro(pId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        if(pedido.status_pedido_ressuprimento !== 'Criado') {
            throw new Erro(400, 'Status do pedido é diferente de: Criado')
        }

        if(pedido.aceito !== null && pedido.aceito) {
            throw new Erro(400, 'O pedido de ressuprimento já encontra-se aceito')
        }

        if(pedido.aceito !== null && !pedido.aceito) {
            throw new Erro(400, 'O pedido de ressuprimento já encontra-se recusado')
        }

        const timeZone = 'America/Sao_Paulo'

        const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', { timeZone });

        let dataHoje = dateTimeFormat.format(new Date());
        dataHoje = parse(dataHoje, 'dd/MM/yyyy', new Date())
        if(!isValid(dataHoje)) {
            throw new Erro(400, 'Erro no parse da data hoje')
        }

        let dados = {}

        if(pAceito) {
            dados = {
                aceito: pAceito,
                data_aceitacao: dataHoje
            }
        } else {
            dados = {
                aceito: pAceito,
                status_pedido_ressuprimento: 'Não aceito'
            }
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pId) },
                individualHooks: true,
                transaction: pTransacao
            }
        )
        
        if(pAceito) {
            const novoPagamento = await this.pagamento.criaPagamentoRessuprimento(pedido.id, pTransacao)
            if(!novoPagamento) {
                throw new Erro(500, 'Registro de pagamento não pode ser criado')
            }
        }

        return pedidoAtualizado
    }

    async realizaPagamento(pId, pDataPagamento, pTipoPagamentoRessuprimento, pTransacao) {
        const pedido = await this.buscaUmRegistro(pId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        // Esse caso não estava descrito
        if(pedido.status_pedido_ressuprimento !== 'Criado') {
            throw new Erro(400, 'Status do pedido é diferente de: Criado')
        }

        // Esse caso não estava descrito
        if(pedido.aceito !== true) {
            throw new Erro(404, 'Pedido de Ressuprimento não foi aceito pelo fornecedor')
        }

        const dataPagamento = parse(pDataPagamento, 'dd/MM/yyyy', new Date())
        if(!isValid(dataPagamento)) {
            throw new Erro(400, 'Data inválida de pagamento')
        }

        if(isBefore(dataPagamento,pedido.data_aceitacao)) {
            throw new Erro(400, 'Data de pagamento não pode ser anterior a data de aceitação do pedido')
        }

        const resultado = await this.pagamento.realizaPagamentoRessuprimento(pId, pedido.data_aceitacao, pDataPagamento, pTipoPagamentoRessuprimento, pTransacao)

        let dados = {
            status_pedido_ressuprimento: 'Em preparação'
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return resultado.multaTotal
    }

    async buscaProdutosPedido(pId) {
        return await this.itemPedidoFornecedor.buscaProdutosPedidoRessuprimento(pId)
    }

    async despachaPedidoInternacional(pId, pDataDespacho, pAlfandegaId, pTransportadoraInternacionalId, pFreteInternacional, pPrevisaoChegada, pTransacao) {
        const pedido = await this.buscaUmRegistro(pId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        // Esse caso não estava descrito
        if(pedido.status_pedido_ressuprimento !== 'Em preparação') {
            throw new Erro(400, 'Status do pedido é diferente de: Em preparação')
        }

        const dataDespacho = parse(pDataDespacho, 'dd/MM/yyyy', new Date())
        if(!isValid(dataDespacho)) {
            throw new Erro(400, 'Data inválida de despacho')
        }

        const notaFiscal = await this.notaFiscal.buscaNotaFiscal(pedido.id)
        if(!notaFiscal) {
            throw new Erro(404, 'Nota Fiscal não encontrada para esse pedido')
        }

        if(isBefore(dataDespacho, notaFiscal.data_emissao)){
            throw new Erro(400, 'Data de despacho não deve ser anterior a data de emissão da nota fiscal')
        }

        let previsaoChegada = null
        // Se estiver preenchido testa a formatação da data
        if(pPrevisaoChegada !== undefined) {
            previsaoChegada = parse(pPrevisaoChegada, 'dd/MM/yyyy', new Date())
            if(!isValid(previsaoChegada)) {
                throw new Erro(400, 'Data inválida de previsão de chegada')
            }
        }

        const alfandegaInternacional = await this.alfandegaInternacional.buscaUmRegistro(pAlfandegaId)
        if(!alfandegaInternacional) {
            throw new Erro(404, 'Alfândega internacional não cadastrada na base de dados')
        }

        const transportadoraInternacional = await this.transportadoraInternacional.buscaUmRegistro(pTransportadoraInternacionalId)
        if(!transportadoraInternacional) {
            throw new Erro(404, 'Transportadora internacional não cadastrada na base de dados')
        }

        if(pFreteInternacional < 0.0 || typeof pFreteInternacional !== 'number') {
            throw new Erro(400, 'Frete internacional inválido. Valor do frete deve ser numérico e maior ou igual a 0')
        }

        const entrega = await this.transportadoraInternacional.entregaAlfandegaInternacional(transportadoraInternacional.id, alfandegaInternacional.id)
        if(!entrega) {
            throw new Erro(400, `A transportadora ${transportadoraInternacional.nome} não realiza transporte para a alfandega ${alfandegaInternacional.nome}`)
        }

        let dados = {
            data_despacho: dataDespacho,
            alfandega_internacional_id: alfandegaInternacional.id,
            transportadora_internacional_id: transportadoraInternacional.id,
            frete_internacional: pFreteInternacional,
            previsao_chegada: previsaoChegada,
            origem_ressuprimento: 'Internacional',
            status_pedido_ressuprimento: 'Despachado para alfandega internacional',
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async despachaPedidoNacional(pId, pDataDespacho, pTransportadoraLocalId, pFreteLocal, pPrevisaoChegada, pTransacao) {
        const pedido = await this.buscaUmRegistro(pId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        // Esse caso não estava descrito
        if(pedido.status_pedido_ressuprimento !== 'Em preparação') {
            throw new Erro(400, 'Status do pedido é diferente de: Em preparação')
        }

        const dataDespacho = parse(pDataDespacho, 'dd/MM/yyyy', new Date())
        if(!isValid(dataDespacho)) {
            throw new Erro(400, 'Data inválida de despacho')
        }

        const notaFiscal = await this.notaFiscal.buscaNotaFiscal(pedido.id)
        if(!notaFiscal) {
            throw new Erro(404, 'Nota Fiscal não encontrada para esse pedido')
        }

        if(isBefore(dataDespacho, notaFiscal.data_emissao)){
            throw new Erro(400, 'Data de despacho não deve ser anterior a data de emissão da nota fiscal')
        }

        const transportadoraLocal = await this.transportadoraLocal.buscaUmRegistro(pTransportadoraLocalId)
        if(!transportadoraLocal) {
            throw new Erro(404, 'Transportadora local não cadastrada na base de dados')
        }

        if(pFreteLocal < 0.0 || typeof pFreteLocal !== 'number') {
            throw new Erro(400, 'Frete local inválido. Valor do frete deve ser numérico e maior ou igual a 0')
        }

        let previsaoChegada = null
        // Se estiver preenchido testa a formatação da data, isso garante que o preenchimento da data de previsão de chegada seja um parâmetro opcional
        if(pPrevisaoChegada !== undefined) {
            previsaoChegada = parse(pPrevisaoChegada, 'dd/MM/yyyy', new Date())
            if(!isValid(previsaoChegada)) {
                throw new Erro(400, 'Data inválida de previsão de chegada')
            }
            if(isBefore(previsaoChegada, dataDespacho)){
                throw new Erro(400, 'Data de previsão de chegada não deve ser anterior a data de despacho')
            }
        }
        
        let dados = {
            data_despacho: dataDespacho,
            transportadora_local_id: transportadoraLocal.id,
            frete_local: pFreteLocal,
            previsao_chegada: previsaoChegada,
            origem_ressuprimento: 'Nacional',
            status_pedido_ressuprimento: 'Despachado para transportadora local',
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async chegadaAlfandega(pPedido, pDataChegada, pAlfandega, pTransacao) {

        if(pDataChegada === undefined) {
            throw new Erro (400, 'Parâmetro de data com erro de escrita')
        }

        const dataChegada = parse(pDataChegada, 'dd/MM/yyyy', new Date())
        if(!isValid(dataChegada)) {
            if(pAlfandega === 'internacional') {
                throw new Erro(400, 'Data de chegada em alfandega internacional inválida')
            } else if (pAlfandega === 'nacional') {
                throw new Erro(400, 'Data de chegada em alfandega nacional inválida')
            }
        }

        let dados = {}

        if(pAlfandega === 'internacional') {
            if(pPedido.status_pedido_ressuprimento !== 'Despachado para alfandega internacional') {
                throw new Erro(400, 'Status do pedido é diferente de: Despachado para alfandega internacional')
            }

            if(isBefore(dataChegada, pPedido.data_despacho)) {
                throw new Erro(400, 'Data de chegada na alfandega internacional não pode ser anterior a data de despacho')
            }

            dados = {
                chegada_alfandega_int: dataChegada,
                status_pedido_ressuprimento: 'Chegada em alfandega internacional'
            }

        } else if (pAlfandega === 'nacional') {
            if(pPedido.status_pedido_ressuprimento !== 'Liberado pela alfandega internacional') {
                throw new Erro(400, 'Status do pedido é diferente de: Liberado pela alfandega internacional')
            }

            if(isBefore(dataChegada, pPedido.liberacao_alfandega_int)) {
                throw new Erro(400, 'Data de chegada na alfandega nacional não pode ser anterior a data de liberação da alfandega internacional')
            }

            dados= {
                chegada_alfandega_nac: dataChegada,
                status_pedido_ressuprimento: 'Chegada em alfandega nacional'
            }
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pPedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async liberacaoAlfandega(pPedido, pDataLiberacao, pAlfandegaNacionalId, pTransacao) {

        if(pDataLiberacao === undefined) {
            throw new Erro(400, 'Parâmetro de data com erro de escrita')
        }

        const isAlfandegaInternacional = (pAlfandegaNacionalId) ? true : false

        const dataLiberacao = parse(pDataLiberacao, 'dd/MM/yyyy', new Date())

        let dados = {}

        if(isAlfandegaInternacional) {
            if(!isValid(dataLiberacao)) {
                throw new Erro(400, 'Data de liberacao por alfandega internacional inválida')
            }

            if(isBefore(dataLiberacao, pPedido.chegada_alfandega_int)) {
                throw new Erro(400, 'Data de liberação por alfandega internacional não pode ser anterior a data de chegada na alfandega internacional')
            }

            const alfandegaNacional = await this.alfandegaNacional.buscaUmRegistro(pAlfandegaNacionalId)
            if(!alfandegaNacional) {
                throw new Erro(404, 'Alfândega nacional não cadastrada na base de dados')
            }

            const entrega = await this.transportadoraInternacional.entregaAlfandegaNacional(pPedido.transportadora_internacional_id, alfandegaNacional.id)
            if(!entrega) {
                throw new Erro(400, `A transportadora não realiza transporte para a alfandega ${alfandegaNacional.nome}`)
            }

            dados = {
                alfandega_nacional_id: alfandegaNacional.id,
                liberacao_alfandega_int: dataLiberacao,
                status_pedido_ressuprimento: 'Liberado pela alfandega internacional'
            }

        } else {
            if(!isValid(dataLiberacao)) {
                throw new Erro(400, 'Data de liberacao por alfandega nacional inválida')
            }

            if(isBefore(dataLiberacao, pPedido.chegada_alfandega_nac)) {
                throw new Erro(400, 'Data de liberação por alfandega nacional não pode ser anterior a data de chegada na alfandega nacional')
            }

            dados = {
                liberacao_alfandega_nac: dataLiberacao,
                status_pedido_ressuprimento: 'Liberado pela alfandega nacional'
            }
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pPedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )
    }

    async entregaPedidoInternacional(pPedido, pDataSaidaNacional, pFreteLocal, pTransportadoraLocalId, pPrevisaoChegada, pTransacao) {
        // Esse caso não estava descrito
        if(pPedido.status_pedido_ressuprimento !== 'Liberado pela alfandega nacional') {
            throw new Erro(400, 'Status do pedido é diferente de: Liberado pela alfândega nacional')
        }

        const dataSaidaNacional = parse(pDataSaidaNacional, 'dd/MM/yyyy', new Date())
        if(!isValid(dataSaidaNacional)) {
            throw new Erro(400, 'Data de saída inválida')
        }

        if(isBefore(dataSaidaNacional, pPedido.liberacao_alfandega_nac)){
            throw new Erro(400, 'Data de saida nacional não pode ser anterior a data de liberação da alfandega nacional')
        }

        if(!pTransportadoraLocalId) {
            throw new Erro(400, 'Transportadora Local não preenchida')
        }

        const transportadoraLocal = await this.transportadoraLocal.buscaUmRegistro(pTransportadoraLocalId)
        if(!transportadoraLocal) {
            throw new Erro(404, 'Transportadora local não cadastrada na base de dados')
        }

        if(pFreteLocal < 0.0 || typeof pFreteLocal !== 'number') {
            throw new Erro(400, 'Frete local inválido. Valor do frete deve ser numérico e maior ou igual a 0')
        }

        let previsaoChegada = null
        // Se estiver preenchido testa a formatação da data, isso garante que o preenchimento da data de previsão de chegada seja um parâmetro opcional
        if(pPrevisaoChegada !== undefined) {
            previsaoChegada = parse(pPrevisaoChegada, 'dd/MM/yyyy', new Date())
            if(!isValid(previsaoChegada)) {
                throw new Erro(400, 'Data inválida de previsão de chegada')
            }
            if(isBefore(previsaoChegada, dataSaidaNacional)) {
                throw new Erro(400, 'Data de previsão de chegada não pode ser anterior a data de saída nacional')
            }
        }

        let dados = {
            saida_nacional: dataSaidaNacional,
            transportadora_local_id: transportadoraLocal.id,
            frete_local: pFreteLocal,
            previsao_chegada: previsaoChegada,
            status_pedido_ressuprimento: 'Em rota de entrega',
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pPedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async entregaPedidoNacional (pPedido, pDataSaidaNacional, pTransacao) {
        // Esse caso não estava descrito
        if(pPedido.status_pedido_ressuprimento !== 'Despachado para transportadora local') {
            throw new Erro(400, 'Status do pedido é diferente de: Despachado para transportadora local')
        }

        const dataSaidaNacional = parse(pDataSaidaNacional, 'dd/MM/yyyy', new Date())
        if(!isValid(dataSaidaNacional)) {
            throw new Erro(400, 'Data de saída inválida')
        }

        if(isBefore(dataSaidaNacional, pPedido.data_despacho)){
            throw new Erro(400, 'Data de saída nacional não pode ser anterior a data de despacho nacional')
        }

        let dados = {
            saida_nacional: dataSaidaNacional,
            status_pedido_ressuprimento: 'Em rota de entrega'
        }

        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pPedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async recebeProdutos (pId, pDataChegada, pTransacao) {
        const pedido = await this.buscaUmRegistro(pId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        if(pedido.status_pedido_ressuprimento !== 'Em rota de entrega') {
            throw new Erro(400, 'Status do pedido é diferente de: Em rota de entrega')
        }

        const dataChegada = parse(pDataChegada, 'dd/MM/yyyy', new Date())
        if(!isValid(dataChegada)) {
            throw new Erro(400, 'Data inválida de chegada')
        }

        if(isBefore(dataChegada, pedido.saida_nacional)){
            throw new Erro(400, 'Data de chegada não pode ser anterior a data de saída nacional')
        }

        const produtosPedido = await this.itemPedidoFornecedor.buscaProdutosPedidoRessuprimento(pedido.id)

        for(const produtoPedido of produtosPedido) {
            const { produto_id, quantidade_pedida, preco_acordado } = produtoPedido;

            const produto = await this.produtos.buscaUmRegistro(produto_id)
            if(!produto) {
                throw new Erro(404, 'Produto não encontrado')
            }

            // Atualiza registro do produto no deposito
            await this.produtos.recebeProdutos(produto, quantidade_pedida, preco_acordado, pTransacao)
        }

        let dados = {
            data_chegada: dataChegada,
            status_pedido_ressuprimento: 'Pedido entregue'
        }
    
        const pedidoAtualizado = await database[this.nomeDoModelo].update(dados,
            { 
                where: { id: Number(pedido.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return pedidoAtualizado
    }

    async buscaPagamento (pId) {
        return await this.pagamento.buscaPagamento(pId)
    }
}

module.exports = RessuprimentoServices