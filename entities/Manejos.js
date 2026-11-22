class Manejo {
  constructor( id_manejo, cultura_id, tipo_manejo, descricao_manejo, data_manejo, cultura_nome ) {
    this.id_manejo = id_manejo;
    this.cultura_id = cultura_id;
    this.tipo_manejo = tipo_manejo;
    this.descricao_manejo = descricao_manejo;
    this.data_manejo = data_manejo;
    this.cultura_nome = cultura_nome;
  }
}

module.exports = Manejo;
