//--------------------------------------------------------------------------------------------------------------
//  Twilio × kintone ハンズオンサンプルプログラム
//  カスタマイズビューで表示したボタンをクリックされたらレコードを追加する
//  Cybozu, Inc.
//--------------------------------------------------------------------------------------------------------------
(function () {

    "use strict";
    
    function loadJS(src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    }
    loadJS('https://cdn.jsdelivr.net/foundation/5.2.2/js/vendor/jquery.js');
    
	//レコード一覧表示イベント
	kintone.events.on('app.record.index.show', function(event) {

		//カスタマイズビュー以外の場合は終了。
                //ここの値は自身のカスタマイズビューIDと入れ替える。
		if (event.viewId != 5119208) return;

		//==================================================
		//カスタマイズビューの登録ボタンクリック時の処理
		//==================================================
		$('#btn_reserve').click(function() {
		
			//入力データの取得
			var name = $("#visitor_name").val();
			var tel = $("#visitor_tel").val();
			var number = $("#visitor_number").val();
			var seat = $("input[name='visitor_seat']:checked").val();

			//kintone登録用のJSONデータ作成
			var kintoneData = {};
			kintoneData.app = kintone.app.getId();
			var record = {};
			record.name = {value: name};
			record.tel = {value: tel};
			record.number = {value: number};
			record.seat = {value: seat};
			kintoneData.record = record;
			
			//kintoneへデータを登録
			kintone.api('/k/v1/record', 'POST', kintoneData, function(resp) {
				alert("受け付けが完了しました。\n呼び出しまでお待ち下さい。");
				location.reload();
			},function(resp) {
				alert("登録に失敗しました。\n" + resp.message);
			});
			
		});

	});

})();
