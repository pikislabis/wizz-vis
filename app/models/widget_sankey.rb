class WidgetSankey < Widget
  # ==========================================================
  # Default values
  # ==========================================================
  default :granularity, 'all'

  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w(all) }, allow_blank: false
end
