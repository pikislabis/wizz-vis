FactoryBot.define do
  factory :filter do
    association :dimension
    association :filterable
  end

  factory :widget_filter, class: Filter do
    association :dimension
    association :filterable, factory: :widget
  end

  factory :dashboard_filter, class: Filter do
    association :dimension
    association :filterable, factory: :dashboard
  end

  factory :application_filter, class: Filter do
    association :dimension, factory: :application_dimension
    association :filterable, factory: :widget
    operator 'eq'
    value 'http'
  end
end
