class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  has_many :projects
  has_many :project_members
  has_many :member_projects, through: :project_members, source: :project
  has_many :tasks, foreign_key: :assigned_to_id
end
