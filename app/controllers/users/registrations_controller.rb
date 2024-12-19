# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
   before_action :configure_permitted_parameters, if: :devise_controller?
  include RackSessionFix
  respond_to :json

  def destroy
    current_user.destroy
    render json: { message: 'Account deleted successfully.' }, status: :ok
  end

  private

  def respond_with(resource, _opts = {})
    if request.method == 'POST' && resource.persisted?
      puts "---------------------------------"
      Rails.logger.debug "Received Params: #{resource.inspect}"
      render json: {
        message: 'Signed up sucessfully.',
        data: resource
      }, status: :ok
    elsif request.method == "DELETE"
      render json: {
        message: 'Account deleted successfully.',
      }, status: :ok
    else
      render json: {
        message: "User couldn't be created successfully.",
        errors: resource.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email, :password, :password_confirmation])
  #  devise_parameter_sanitizer.permit(:account_update, keys: [:name, :email, :password, :current_password,  :password_confirmation, :current_password])
  end
end
