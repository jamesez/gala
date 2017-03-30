class CommentThread < ApplicationRecord
  include Authority::Abilities

  belongs_to :reader
  belongs_to :group
  belongs_to :card
  belongs_to :case
  has_many :comments, dependent: :restrict_with_error

  def collocutors
    comments.map(&:reader).uniq
  end
  def visible_to_reader?(r)
    locale == I18n.locale.to_s && (comments.length > 0 || reader == r)
  end

end
