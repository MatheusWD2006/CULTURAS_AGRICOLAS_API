class Cultura {
  constructor( id_cultura, planta_id, hectares, data_plantio, data_colheita ) {
    this.id_cultura = id_cultura;
    this.planta_id = planta_id;
    this.hectares = hectares;
    this.data_plantio = data_plantio;
    this.data_colheita = data_colheita;
  }
}

module.exports = Cultura;