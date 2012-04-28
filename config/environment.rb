# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Paleio::Application.initialize!

ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.perform_deliveries = true
ActionMailer::Base.raise_delivery_errors = true
ActionMailer::Base.smtp_settings = {
    :address => "smtp.sendgrid.net",
    :port => 587,
    :authentication => :plain,
    :user_name => 'yourusername',
    :password => 'yourpassword',
    :domain => 'yourdomain.tld'
}
