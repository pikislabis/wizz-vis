FactoryBot.define do
  factory :widget, class: Widget do
    title 'Widget Serie'
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'P1D'
  end

  factory :widget_table, class: WidgetTable do
    title 'Widget Table'
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'all'
  end

  factory :widget_range, class: Widget do
    title 'Widget Serie'
    association :dashboard, factory: :dashboard
    association :datasource
  end
end
