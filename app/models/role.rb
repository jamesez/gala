# frozen_string_literal: true

class Role < ApplicationRecord
  has_and_belongs_to_many :readers, join_table: :readers_roles

  belongs_to :resource, polymorphic: true,
                        optional: true

  validates :resource_type, inclusion: { in: Rolify.resource_types },
                            allow_nil: true

  default_scope { order('id ASC') }

  scopify
end
