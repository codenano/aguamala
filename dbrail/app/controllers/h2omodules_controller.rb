class H2omodulesController < ApplicationController
  before_action :set_h2omodule, only: [:show, :edit, :update, :destroy]

  # GET /h2omodules
  # GET /h2omodules.json
  def index
    @h2omodules = H2omodule.all
  end

  # GET /h2omodules/1
  # GET /h2omodules/1.json
  def show
  end

  # GET /h2omodules/new
  def new
    @h2omodule = H2omodule.new
  end

  # GET /h2omodules/1/edit
  def edit
  end

  # POST /h2omodules
  # POST /h2omodules.json
  def create
    @h2omodule = H2omodule.new(h2omodule_params)

    respond_to do |format|
      if @h2omodule.save
        format.html { redirect_to @h2omodule, notice: 'H2omodule was successfully created.' }
        format.json { render action: 'show', status: :created, location: @h2omodule }
      else
        format.html { render action: 'new' }
        format.json { render json: @h2omodule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /h2omodules/1
  # PATCH/PUT /h2omodules/1.json
  def update
    respond_to do |format|
      if @h2omodule.update(h2omodule_params)
        format.html { redirect_to @h2omodule, notice: 'H2omodule was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @h2omodule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /h2omodules/1
  # DELETE /h2omodules/1.json
  def destroy
    @h2omodule.destroy
    respond_to do |format|
      format.html { redirect_to h2omodules_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_h2omodule
      @h2omodule = H2omodule.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def h2omodule_params
      params.require(:h2omodule).permit(:name)
    end
end
