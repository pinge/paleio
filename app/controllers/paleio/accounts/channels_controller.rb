module Paleio
  module Accounts

    class ChannelsController < ApplicationController

      before_filter :authenticate_user!
      before_filter :find_account

      def index
        respond_to do |format|
          format.json{
            render :json => @account.channels.all.to_json, :status => :ok
          }
        end
      end

      def create
        respond_to do |format|
          format.json{
            begin
              @account.channels.create!(params[:channel].merge!({ :created_by => current_user }))
              render :json => {}.to_json, :status => :created
            rescue ActiveRecord::RecordInvalid => e
              render :json => { :errors => { :adhoc => e.record.errors.messages.map{ |k,v| { "channel[#{k}]" => v } }, :global => ['there are errors in the form'] } }.to_json, :status => :bad_request
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