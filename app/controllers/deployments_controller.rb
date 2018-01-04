# frozen_string_literal: true

class DeploymentsController < ApplicationController
  before_action :set_deployment, only: %i[edit update]
  before_action :ensure_content_item_selection_params_set!, only: [:create]
  before_action :authorize_action_with_selection_params, only: %w[edit update]
  after_action :clear_content_item_selection_params, only: [:update]

  layout 'embed'

  # POST /groups/1/deployments
  def create
    the_group = Group.find params[:group_id]
    the_case = Case.find_by_slug params[:case_slug]

    @deployment = Deployment.find_or_initialize_by(
      group: the_group, case: the_case
    ) do |d|
      d.answers_needed = 0
    end

    redirect_to edit_deployment_path @deployment if @deployment.save
  end

  # GET /deployments/1/edit
  def edit
    set_selection_params
    set_recommended_quizzes
  end

  # PATCH/PUT /deployments/1
  def update
    author_id = current_reader.try :id
    customizer = CustomizeDeploymentService.new @deployment, author_id, lti_uid

    result = customizer.customize(**deployment_params)

    if result.errors.empty?
      render
    else
      render json: result.errors, status: :unprocessable_entity
    end
  end

  private

  def set_deployment
    @deployment = Deployment.find params[:id]
  end

  def authorize_action_with_selection_params
    selection_params = session[:content_item_selection_params]
    authorize_action_for @deployment, selection_params: selection_params
  end

  def lti_uid
    session[:content_item_selection_params].try :[], 'lti_uid'
  end

  def set_recommended_quizzes
    reader = reader_signed_in? ? current_reader : nil
    recommended_quizzes = @deployment.case.quizzes.recommended
    custom_quizzes = @deployment.case.quizzes
                                .authored_by reader: reader, lti_uid: lti_uid

    @recommended_quizzes = [] + recommended_quizzes + custom_quizzes
  end

  def set_selection_params
    @selection_params = session[:content_item_selection_params]
  end

  def ensure_content_item_selection_params_set!
    redirect_to root_url unless session[:content_item_selection_params]
    set_selection_params
  end

  def clear_content_item_selection_params
    session[:content_item_selection_params] = nil
  end

  def deployment_params
    params.require(:deployment).permit(
      :answers_needed, :quiz_id,
      custom_questions: [:id, :content, :correct_answer, options: []]
    )
          .to_h
          .symbolize_keys
  end
end
