class DimensionsController < ApplicationController
  def values
    datasource = Datasource.find(params[:datasource_id].to_i)
    dimension  = datasource.dimensions.find_by(name: params[:dimension_name])
    limit = params.fetch(:limit, 10)

    if dimension
      render json: dimension.topN(limit: limit, range: params[:range],
                                  start_time: params[:start_time],
                                  end_time: params[:end_time],
                                  condition: params[:query])
    else
      render json: []
    end
  end
end
