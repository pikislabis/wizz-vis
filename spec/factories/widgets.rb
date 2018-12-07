FactoryBot.define do
  factory :widget, class: Widget do
    title 'Widget Serie'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'P1D'
  end

  factory :widget_table, class: Widget do
    title 'Widget Table'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'all'
  end

  factory :widget_range, class: Widget do
    title 'Widget Serie'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
  end
end
