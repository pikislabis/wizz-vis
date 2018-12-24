class Dashboard < ApplicationRecord
  include Defaults
  include Api::DashboardApi

  # ==========================================================
  # Default values
  # ==========================================================
  default :theme, 'light'

  # ==========================================================
  # Relations
  # ==========================================================
  has_many :widgets, dependent: :destroy
  has_many :filters, as: :filterable, dependent: :destroy
  has_many :datasources, through: :widgets
  has_many :dimensions, -> { distinct }, through: :datasources

  accepts_nested_attributes_for :widgets
  accepts_nested_attributes_for :filters

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, presence: true
  validates :theme, inclusion: { in: %w[light dark] }

  def dimensions
    super.uniq(&:name)
  end

  def self.search(search)
    if search
      where(
        'name ILIKE ?',
        "%#{search.split.join('%')}%"
      )
    else
      all
    end
  end
end
