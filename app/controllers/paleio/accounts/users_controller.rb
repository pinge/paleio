module Paleio
  module Accounts

    class UsersController < ApplicationController

      before_filter :authenticate_user!
      before_filter :find_account

      def index
        respond_to do |format|
          format.json{
            render :json => @account.users.all.to_json, :status => :ok
          }
        end
      end

      def create
        respond_to do |format|
          format.json{
            begin
              @account.invite_user!(params[:user].merge!({ :created_by => current_user.id }))
              render :json => {}.to_json, :status => :created
            rescue ActiveRecord::RecordNotSaved => e
              Rails.logger.ap e
              Rails.logger.ap e.message
              Rails.logger.ap e.record
              Rails.logger.ap e.record.errors
            rescue ActiveRecord::RecordInvalid => e
              render :json => { :errors => { :adhoc => e.record.errors.messages.map{ |k,v| { "user[#{k}]" => v } }, :global => ['there are errors in the form'] } }.to_json, :status => :bad_request
            end
          }
        end
      end

      private
      def find_account
        @account = current_user.accounts.find(params[:account_id])
      end

    end

  end
end