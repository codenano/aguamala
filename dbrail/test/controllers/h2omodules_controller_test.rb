require 'test_helper'

class H2omodulesControllerTest < ActionController::TestCase
  setup do
    @h2omodule = h2omodules(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:h2omodules)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create h2omodule" do
    assert_difference('H2omodule.count') do
      post :create, h2omodule: { name: @h2omodule.name }
    end

    assert_redirected_to h2omodule_path(assigns(:h2omodule))
  end

  test "should show h2omodule" do
    get :show, id: @h2omodule
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @h2omodule
    assert_response :success
  end

  test "should update h2omodule" do
    patch :update, id: @h2omodule, h2omodule: { name: @h2omodule.name }
    assert_redirected_to h2omodule_path(assigns(:h2omodule))
  end

  test "should destroy h2omodule" do
    assert_difference('H2omodule.count', -1) do
      delete :destroy, id: @h2omodule
    end

    assert_redirected_to h2omodules_path
  end
end
