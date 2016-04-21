<div class="modal fade" id="newUserModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="newUserModalLabel">New User</h4>
			</div>
			<div class="errors"></div>
			<form action="/addNewUser" method="post" id="addNewUserForm">
				<div class="modal-body">
					<input type="hidden" class="form-control" name="_token" value="{{ csrf_token() }}">
					<div class="form-group">
						<label class="control-label" for="nameInput">Name</label>
						<input type="name" class="form-control" name="name" id="nameInput">
					</div>
					<div class="form-group">
						<label class="control-label" for="emailInput">Email</label>
						<input type="email" class="form-control" name="email" id="emailInput">
					</div>
					<div class="form-group">
						<label class="control-label" for="passwordInput">Password</label>
						<input type="password" class="form-control" name="password" id="passwordInput">
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
		</div>
	</div>
</div>