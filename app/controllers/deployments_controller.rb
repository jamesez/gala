# frozen_string_literal: true

# @see Deployment
class DeploymentsController < ApplicationController
  include SelectionParams

  before_action :authenticate_reader!, only: %i[new create]
  before_action :set_deployments, only: %i[index create]
  before_action :set_deployment, only: %i[edit update]
  after_action :clear_content_item_selection_params, only: [:update]

  layout 'admin'

  decorates_assigned :deployments, with: DeploymentsDecorator

  def index
    @deployment ||= Deployment.new
    prepare_for_form
  end

  def new
    @deployment ||= Deployment.new autofill_params
    prepare_for_form
  end

  def create
    @deployment = Deployment.new deployment_params
    prepare_for_form

    if @deployment.save
      @deployment.group.add_administrator current_reader
      redirect_to deployments_path, notice: successfully_created
    else
      render :new
    end
  end

  # @route [GET] `/deployments/1/edit`
  def edit
    authorize @deployment
    set_selection_params
    set_recommended_quizzes
    render layout: 'embed' if selection_params.present?
  end

  # @route [PATCH/PUT] `/deployments/1`
  def update
    authorize @deployment

    result = customizer.customize(**customized_deployment_params)
    if result.errors.empty?
      render
    else
      render json: result.errors, status: :unprocessable_entity
    end
  end

  private

  def set_deployments
    @deployments = DeploymentPolicy::AdminScope.new(current_user, Deployment)
                                               .resolve
  end

  def set_deployment
    @deployment = Deployment.find params[:id]
  end

  def prepare_for_form
    @deployment.build_group if @deployment.group.blank?
    @case = @deployment.case.decorate if @deployment.case.present?
  end

  def autofill_params
    if params.key? :case_slug
      { case: Case.friendly.find(params[:case_slug]) }
    else
      {}
    end
  end

  def deployment_params
    params.require(:deployment)
          .permit(:case_id, :group_id, group_attributes: %i[name])
  end

  def set_recommended_quizzes
    reader = reader_signed_in? ? current_reader : nil
    recommended_quizzes = @deployment.case.quizzes.recommended
    custom_quizzes = @deployment.case.quizzes
                                .authored_by reader: reader, lti_uid: lti_uid

    @recommended_quizzes = [] + recommended_quizzes + custom_quizzes
  end

  def customizer
    author_id = current_reader.try :id
    CustomizeDeploymentService.new @deployment, author_id, lti_uid
  end

  def customized_deployment_params
    params.require(:deployment).permit(
      :answers_needed, :quiz_id,
      custom_questions: [:id, :content, :correct_answer, options: []]
    )
          .to_h
          .symbolize_keys
  end
end
