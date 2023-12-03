const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')

class ItemNotaFiscalServices extends Services {
    constructor() {
        super('Item_Nota_Fiscal')
    }

    async criaItemNotaFiscal(pNotaFiscalId, pProdutos, pTransacao) {
        // ITERA SOBRE OS PRODUTOS
        for(const produtoInfo of pProdutos) {
            const { id, quantidade_pedida, preco_acordado } = produtoInfo;
            
            // CRIA UM NOVO ITEM_NOTA_FISCAL
            await database[this.nomeDoModelo].create(
                {
                    quantidade_nf: quantidade_pedida,
                    preco_nf: preco_acordado,
                    nota_fiscal_id: pNotaFiscalId,
                    item_pedido_fornecedor_id: id
                },
                {
                    transaction: pTransacao
                }
            )
        }
    }
}

module.exports = ItemNotaFiscalServices