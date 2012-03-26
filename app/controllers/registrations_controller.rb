class RegistrationsController < Devise::RegistrationsController

  def create
    begin
      build_resource
      if resource.save!
        if resource.active_for_authentication?
          set_flash_message :notice, :signed_up if is_navigational_format?
          sign_in(resource_name, resource)
          #respond_with resource, :location => after_sign_up_path_for(resource)
          render :json => { :currentUser => user_signed_in? ? current_user : {}, :token => form_authenticity_token }.to_json, :status => :created
        else
          set_flash_message :notice, :inactive_signed_up, :reason => inactive_reason(resource) if is_navigational_format?
          expire_session_data_after_sign_in!
          respond_with resource, :location => after_inactive_sign_up_path_for(resource)
        end
      else
        clean_up_passwords(resource)
        respond_with_navigational(resource) { render_with_scope :new }
      end
    rescue ActiveRecord::RecordInvalid => e
      render :json => { :errors => { :adhoc => e.record.errors.messages.map{ |k,v| { "user[#{k}]" => v } }, :global => ['login failed'] } }.to_json, :status => :bad_request
    end
  end

end
