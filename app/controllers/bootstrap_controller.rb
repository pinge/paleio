class BootstrapController < ApplicationController

  def show
    respond_to do |format|
      format.json{
        ap current_user

        render :json => {

            :currentUser => user_signed_in? ? current_user.as_json.reject{ |k,v| k == :id } : {},
            :resources => {
                :createUserURL => user_registration_path(:format => :json),
                :createSessionURL => user_session_path(:format => :json),
                :destroySessionURL => destroy_user_session_path(:format => :json),
                :signOutURL => destroy_user_session_path(:format => :json),
                :signInURL => user_session_path(:format => :json),
                :indexChannelsURL => channels_path(:format => :json),
            }

        }.to_json, :status => :ok
      }
    end
  end

end
