class ProjectsController < ApplicationController
    before_action :authenticate_user!

    def members
      @project = Project.find(params[:id])
      all_members = @project.members.to_a
      all_members << @project.user unless all_members.include?(@project.user)
  
      render json: {
        members: all_members.map do |member|
          {
            id: member.id,
            name: member.name,
            email: member.email
          }
        end
      }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Project not found" }, status: :not_found
    end
  
    def create
      logger.info "Received params: #{params[:project]}"

      @project = current_user.projects.new(project_params.except(:member_emails))
  
      if @project.save
        if params[:project][:member_emails].present?
          add_members_to_project(@project, params[:project][:member_emails])
        end
        render json: @project, status: :created
      else
        render json: @project.errors, status: :unprocessable_entity
      end
    end
  
    def index
      @user = current_user # Get the current user
      @projects_created = @user.projects # Projects the user has created
      @projects_as_member = @user.member_projects # Projects where the user is a member
  
      render json: { projects_created: @projects_created, projects_as_member: @projects_as_member }
    end

    def show
        @project = Project.find(params[:id])
    
        render json: @project
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Project not found" }, status: 404
      end
    private
  
    def project_params
      params.require(:project).permit(:title, :description, member_emails: [])
    end
  
    def add_members_to_project(project, member_emails)
      member_emails.each do |email|
        user = User.find_by(email: email)
        if user
          project.members << user unless project.members.include?(user)
        else
          Rails.logger.warn("User with email #{email} not found")
        end
      end
    end
  end
  