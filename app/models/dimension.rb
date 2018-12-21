class Dimension < ApplicationRecord
  include Intervalable

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :datasource
  has_and_belongs_to_many :widgets
  has_many :filters, dependent: :destroy

  attr_reader :range, :start_time, :end_time

  def coordinate?
    name =~ /coordinate|latlong|latlng/
  end

  def topN(limit:, range:, start_time:, end_time:, condition:)
    @range = range
    @start_time = start_time
    @end_time = end_time
    result = query(limit, condition, *interval)
    result[0]&.fetch('result')&.map { |x| x[name] } || []
  end

  private

  def query(limit, condition, start_time, end_time)
    data_source = Druid::DataSource.new(datasource.name, ENV['DRUID_URL'])
    aggregator = datasource.aggregators.find_by(aggregator_type: %w[longSum doubleSum])

    query =
      Druid::Query::Builder.new.topn(
        name, aggregator.name, limit
      ).granularity('all')
    query.interval(start_time, end_time)
    query.send(aggregator.aggregator_type.underscore, aggregator.name)

    if condition.present?
      druid_dimension = Druid::DimensionFilter.new(dimension: name)
      query.filter { druid_dimension.eq(Regexp.new(condition)) }
    end

    data_source.post(query)
  end
end
