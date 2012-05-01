class WelcomeController < ApplicationController

  #prepend_before_filter :require_no_authentication, :only => [ :index ]
  before_filter :authenticate_user!, :except => [:index]

  def index
    Rails.logger.info "index"
    Rails.logger.info user_signed_in?
    Rails.logger.info current_user
    Rails.logger.info user_session
  end

end
