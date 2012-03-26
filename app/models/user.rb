class User < ActiveRecord::Base

  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :name, :nickname, :created_by, :invitation_message

  validates_presence_of :name

  after_create :create_account

  belongs_to :creator,              :class_name => 'User',                        :foreign_key => 'created_by'
  has_many :owned_accounts,         :class_name => 'Paleio::Account',             :foreign_key => 'created_by'
  has_many :account_subscriptions,  :class_name => 'Paleio::AccountSubscription', :foreign_key => 'user_id'
  has_many :accounts, :through => :account_subscriptions, :uniq => true
  has_many :invitations, :class_name => self.class.to_s, :as => :invited_by # invitable module

  def as_json(options = {})
    {
        :id => self.id, :name => self.name, :email => self.email, :account => self.accounts.first,
        :confirmed => !self.confirmed_at.nil?, :invited => !self.invitation_sent_at.nil?,
        :confirmed_at => self.confirmed_at, :invitation_accepted => !self.invitation_accepted_at.nil?,
        :invitation_accepted_at => self.invitation_accepted_at
    }
  end

  def headers_for(action)
    action_string = action.to_s
    Rails.logger.ap action_string
    case action_string
      when "invitation_instructions"
        {
            :subject => "Paleio Invitation instructions (sent by #{self.creator.name})"
        }
      else
        {}
    end
  end

  private
  def create_account
    self.owned_accounts.create! if self.created_by.nil?
    true
  end

end
