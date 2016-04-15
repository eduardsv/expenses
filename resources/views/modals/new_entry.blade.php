<div class="modal fade" id="newEntryModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="newEntryModalLabel">New entry</h4>
			</div>
			<div class="errors"></div>
			<form action="/api/v1/expenses" method="post" id="addNewEntryForm">
				<div class="modal-body">
					<input type="hidden" class="form-control" name="_token" value="{{ csrf_token() }}">
					@if (Auth::check())
						<input type="hidden" class="form-control" name="user_id" value="{{ Auth::user()->id }}">
					@endif
					{{--@if(isset($adminStatus) && $adminStatus > 1)--}}
						{{--<div class="form-group">--}}
							{{--<label class="control-label" for="dateInput">Select user</label>--}}
							{{--<select class="form-control" name="user_id" id="userSelect">--}}
								{{--@foreach($allUsers as $u)--}}
									{{--<option @if($u->id == $user->id) selected @endif value="{{ $u->id }}">{{ $u->name }}</option>--}}
								{{--@endforeach--}}
							{{--</select>--}}
						{{--</div>--}}
					{{--@endif--}}
					<div class="form-group">
						<label class="control-label" for="dateInput">Enter the date</label>
						<input type="date" class="form-control" name="date" id="dateInput">
					</div>
					<div class="form-group">
						<label class="control-label" for="timeInput">Enter the time</label>
						<input type="time" class="form-control" name="time" id="timeInput">
					</div>
					<div class="form-group">
						<label class="control-label" for="amountInput">Enter the amount spent</label>
						<div class="input-group">
							<div class="input-group-addon">$</div>
							<input type="text" class="form-control" name="amount" id="amountInput">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label" for="descriptionInput">Description</label>
						<input type="text" class="form-control" name="description" id="descriptionInput">
					</div>
					<div class="form-group">
						<label class="control-label" for="commentInput">Do you have any comments?</label>
						<textarea name="comment" class="form-control" id="commentInput" rows="4"></textarea>
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