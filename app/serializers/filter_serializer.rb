# frozen_string_literal: true

class FilterSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :operator,
    :value,
    :dimension_name,
    :dimension_id
  )

  def dimension_name
    object.dimension.name
  end
end
