class WidgetSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :type,
    :title,
    :row,
    :col,
    :size_x,
    :size_y,
    :options
  )

  has_many :dimensions
  has_many :aggregators
end
