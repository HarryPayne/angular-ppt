(function() {
  
	/**
	 * 	@name app.modalConfirm
	 * 	@desc A module to support Bootstrap modal windows that ask for
	 * 			confirmation from the user.
	 */
	angular
		.module("app.modalConfirm", [
			"ngAnimate",
			"ui.router",
			"ui.bootstrap",
			"ui.router.modal"
		]);
    
}());
