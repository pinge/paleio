class SessionsController < Devise::SessionsController

  def create
    begin
      resource = warden.authenticate!(:scope => resource_name, :recall => 'sessions#failure')
      sign_in(resource_name, resource)
      render :json => { :currentUser => user_signed_in? ? current_user : {}, :token => form_authenticity_token }.to_json, :status => :created
    rescue Exception => e
      Rails.logger.ap "!!!! sessions create exceptions!!!"
      Rails.logger.ap e.class
      Rails.logger.ap e.message
    end
    #set_flash_message(:notice, :signed_in) if is_navigational_format?
    #sign_in(resource_name, resource)
    #respond_with resource, :location => after_sign_in_path_for(resource)
  end

  def failure
    render :json => { :errors => { :adhoc => {}, :global => ['login failed'] } }.to_json, :status => :bad_request
  end

  def destroy
    signed_in = signed_in?(resource_name)
    redirect_path = after_sign_out_path_for(resource_name)
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    #set_flash_message :notice, :signed_out if signed_in
    # We actually need to hardcode this as Rails default responder doesn't
    # support returning empty response on GET request
    respond_to do |format|
      format.json do
        render :json => { :currentUser => user_signed_in? ? current_user : {} }.to_json, :status => :ok
      end
      format.any(*navigational_formats) { redirect_to redirect_path }
      format.all do
        method = "to_#{request_format}"
        text = {}.respond_to?(method) ? {}.send(method) : ""
        render :text => text, :status => :ok
      end
    end
  end

  #def create
  #  resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#new")
  #  set_flash_message(:notice, :signed_in) if is_navigational_format?
  #  sign_in(resource_name, resource)
  #  respond_to do |format|
  #    format.html { respond_with resource, :location => after_sign_in_path_for(resource) }
  #    format.json {
  #      return render :json => {  :success => true,
  #                                :user => resource
  #      }
  #    }
  #  end
  #end


  #def create
  #  resource = warden.authenticate!(:scope => resource_name, :recall => :failure)
  #  return sign_in_and_redirect(resource_name, resource)
  #end
  #
  #def failure
  #  return render:json => { :success => false, :errors => ["Login failed."] }
  #end

end
