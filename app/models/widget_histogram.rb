class WidgetHistogram < Widget
  # ==========================================================
  # Default values
  # ==========================================================
  default :granularity, 'all'

  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w(all) }, allow_blank: false

  def data
    options['histogram'] ||= {}
    options['histogram']['numBuckets'] = limit || 10
    super
  end
end
