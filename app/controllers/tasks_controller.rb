class TasksController < ApplicationController
    before_action :set_project, only: [:create, :index, :show]
    before_action :set_task, only: [:update, :destroy, :add_label, :show, :resolve, :close, :open]

    def resolve
      @task.resolve!
      render json: { message: 'Task resolved successfully', task: @task }, status: :ok
    end
  
    # Change the state to closed
    def close
      @task.close!
      render json: { message: 'Task closed successfully', task: @task }, status: :ok
    end

    def open
      @task.open!
      render json: { message: 'Task reopened successfully', task: @task }, status: :ok
    end
  
    
    def show
      render json: @task.as_json(include: :labels).merge(creator_name: @task.creator&.name || 'Unknown')
    end

    def add_label
      @label = Label.find(params[:label_id])
      @task.labels << @label unless @task.labels.include?(@label)
      render json: @task.labels, status: :ok
    end

    def filter
      from_date = params[:from_date].present? ? Date.parse(params[:from_date]) : nil
      to_date = params[:to_date].present? ? Date.parse(params[:to_date]) : nil
  
      if from_date && to_date
        @tasks = Task.where(due_date: from_date..to_date)
      else
        @tasks = Task.all
      end
  
      render json: @tasks
    end
  
    def index
      @tasks = @project.tasks
      tasks_with_creator_name = @tasks.map do |task|
        task.as_json(include: :labels).merge(creator_name: task.creator&.name || 'Unknown') # Include creator's name
      end
    
      render json: tasks_with_creator_name
    end
  
    def create
      @task = @project.tasks.new(task_params)
      @task.created_by = current_user.id

      if params[:assigned_to_id].present?
        @task.assigned_to = User.find(params[:assigned_to_id])
      end

      if @task.save
        if params[:label_ids].present?
          labels = Label.where(name: params[:label_ids])
          @task.labels << labels 
        end
        render json: @task.as_json.merge(creator_name: @task.creator.name), status: :created
      else
        render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def update
      if @task.update(task_params)
        if params[:label_ids].present?
          labels = Label.where(name: params[:label_ids])
          
        end
        
    
        render json: @task
      else
        render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def destroy
      @task.destroy
      head :no_content
    end
  
    private
  
    def set_project
      @project = Project.find(params[:project_id])
    end
  
    def set_task
      @task = Task.find(params[:id])
    end
  
    def task_params
      params.require(:task).permit(:title, :description, :assigned_to_id, :estimated_time, :due_date, label_ids: [])
    end

    def comment_params
      params.require(:comment).permit(:content)
    end
  end
  