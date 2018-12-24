class DimensionSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name,
    :datasource_id
  )
end
