class DatasourcesController < ApplicationController

  def index
    render json: Datasource.all
  end
end
