# frozen_string_literal: true

# Other authorizers should subclass this one
class ApplicationAuthorizer < Authority::Authorizer
  # Any class method from Authority::Authorizer that isn't overridden
  # will call its authorizer's default method.
  #
  # @param [Symbol] adjective; example: `:creatable`
  # @param [Object] reader - whatever represents the current user in your app
  # @return [Boolean]
  def self.default(_adjective, reader)
    # 'Whitelist' strategy for security: anything not explicitly allowed is
    # considered forbidden.
    reader.has_cached_role? :editor
  end
end
