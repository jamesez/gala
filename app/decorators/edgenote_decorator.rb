# frozen_string_literal: true

# @see Edgenote
class EdgenoteDecorator < ApplicationDecorator
  def image_url(transforms = {})
    return nil unless image.attached?
    h.url_for image.variant transforms
  end

  def audio_url
    return nil unless audio.attached?
    h.url_for audio
  end
end
