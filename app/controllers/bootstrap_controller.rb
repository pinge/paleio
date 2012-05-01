class BootstrapController < ApplicationController

  def show
    respond_to do |format|
      format.json{
        render :json => {

            :currentUser => user_signed_in? ? current_user.as_json.reject{ |k,v| k == :id } : {},
            # TODO refactor
            :account => user_signed_in? ? (current_user.owned_accounts.empty? ? current_user.accounts.first : current_user.owned_accounts.first) : nil,
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
