require 'druid'

class Widget < ApplicationRecord
  include Intervalable
  include Api::WidgetApi
  include Defaults

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dashboard, touch: true
  belongs_to :datasource
  has_and_belongs_to_many :dimensions
  has_many :filters, as: :filterable, dependent: :destroy
  has_many :aggregator_widgets, dependent: :destroy
  has_many :aggregators, through: :aggregator_widgets
  has_many :post_aggregators, dependent: :destroy

  accepts_nested_attributes_for :aggregator_widgets
  accepts_nested_attributes_for :post_aggregators
  accepts_nested_attributes_for :filters

  # ==========================================================
  # Validations
  # ==========================================================
  validates :row, :col, :size_x, :size_y, presence: true
  validates :row, :col, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :size_x, :size_y, numericality: { only_integer: true, greater_than: 0 }

  # ==========================================================
  # Callbacks
  # ==========================================================
  after_initialize :set_defaults

  def range
    override_interval? ? super : options&.[]('range')
  end

  def start_time
    return super if override_interval?
    global_start_time = options&.[]('start_time')
    Time.parse(global_start_time) if global_start_time.present?
  end

  def end_time
    return super if override_interval?
    global_end_time = options&.[]('end_time')
    Time.parse(global_end_time) if global_end_time.present?
  end

  # If the widget has set one of these attributes, it will use them
  # to calculate the time interval instead the one inherited from dashboard.
  def override_interval?
    %w[range start_time end_time].any? { |k| attributes[k] }
  end

  def granularity
    return super if super || interval.none?

    interval_hours = (interval[1] - interval[0]) / 1.hour

    case interval_hours
    when 0..1 # Less than one hour
      'PT1M'
    when 1..6 # From one to six hours
      'PT5M'
    when 6..168 # From 6 hours to one week
      'PT1H'
    when 168..2160 # From one week to three months
      'P1D'
    when 2160..8760 # From three months to one year
      'P1W'
    else # More than one year
      'P1M'
    end
  end

  #
  # Include filters inherited from global dimension filters.
  #
  def filters
    @filters ||= begin
      (options['filters'] || []).each do |f|
        if f.is_a? Hash
          association(:filters).add_to_target(Filter.new(f))
        else
          association(:filters).add_to_target(f)
        end
      end
      super
    end
  end

  def data(override_filters = nil, override_options = {})
    query(override_filters, override_options).run
  end

  def query(override_filters = nil, override_options = {})
    Datastore::Query.new(
      datasource: datasource.name,
      properties: attributes.with_indifferent_access.merge(
        intervals: intervals,
        granularity: granularity
      ).merge(override_options),
      dimensions: dimensions,
      aggregators: aggregator_widgets.includes(:aggregator, :filters),
      post_aggregators: post_aggregators,
      filters: override_filters || filters,
      options: options
    )
  end

  private

  def set_defaults
    self.row    ||= 0
    self.col    ||= 0
    self.size_x ||= 4
    self.size_y ||= 4
  end

  def compare_data
    intervals.map do |i|
      Widget.instance_method(:data)
            .bind(self).call(nil, granularity: 'all', intervals: [i])
    end.flatten
  end
end
