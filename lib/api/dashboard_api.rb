module Api::DashboardApi
  def initialize(params)
    if params
      filters_from_params(params)
      super(params)
    else
      super
    end
  end

  private

  def filters_from_params(params)
    return unless params[:filters]
    params[:filters_attributes] = build_filter_params(params[:filters]).map do |filter|
      ActionController::Parameters.new(filter).permit!
    end
    params.delete(:filters)
  end

  def build_filter_params(filters = [])
    filters.map do |filter|
      dimension = Dimension.find_by(name: filter[:dimension_name])
      {
        dimension_id: dimension.id,
        operator: filter[:operator],
        value: filter[:value]
      }
    end
  end
end
