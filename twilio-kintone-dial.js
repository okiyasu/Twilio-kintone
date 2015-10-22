//--------------------------------------------------------------------------------------------------------------
//  Twilio × kintone ハンズオンサンプルプログラム
//  詳細画面に呼び出し用とSMS送信用のボタンを表示する。
//  それぞれクリックすると呼び出しとSMS送信をおこなう。
//  
//  SMS送信サンプルをベースに改造
//  By okiyasu
//--------------------------------------------------------------------------------------------------------------
(function () {
    "use strict";

    // Twilio認証パラメーター（Twilioダッシュボードで確認可能）
    var ACCOUNT_SID = '{account_sid}';
    var AUTH_TOKEN  = '{auth_token}';
    // 呼び出し用の発信元番号。050が使用可能
    var FROM_DIAL = '{from_dial}';
    // SMS送信用の発信元番号。050が使えないので、USの番号を使用する事
    var FROM_SMS    = '{from_sms}';

    // レコード詳細表示イベント
    kintone.events.on('app.record.detail.show', function (event) {
        // 呼び出しボタンを表示
        var DialButton = document.createElement('button');
            DialButton.id = 'dial_button';
            DialButton.innerHTML = '呼び出し';
        DialButton.onclick = function () {
            dial(event);
            }
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(DialButton);
        // 呼び出しボタンを表示
        var SendSMSButton = document.createElement('button');
            SendSMSButton.id = 'send_sms_button';
            SendSMSButton.innerHTML = 'SMS送信';
        SendSMSButton.onclick = function () {
            sendSMS(event);
            }
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(SendSMSButton);

        // SMS送信処理
        function sendSMS(event) {
            // レコードから名前と電話番号を取得
            var rec = kintone.app.record.get();
            var name = rec.record.name.value;
            var to = rec.record.tel.value;

            // Twilio APIのURL
            var url = "https://" + ACCOUNT_SID + ":" + AUTH_TOKEN + 
                    "@api.twilio.com/2010-04-01/Accounts/" + ACCOUNT_SID + "/Messages";

            // HTTPヘッダー
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'};

            // SMS送信先の電話番号（トライアルアカウントの場合は検証済み電話番号のみ送信先可能なので注意）
            // 入力されたパターンに応じてプレフィックスをつける。
            if ((" " + to).indexOf(" 0") !== -1) {
                to = (" " + to).replace(/ 0/g, "+81");
            } else if ((" " + to).indexOf(" +") === -1){
                to = "+" + to;
            }

            // 送信データ
            var data = 'From=' + encodeURIComponent(FROM_SMS) +
                        '&To=' + encodeURIComponent(to) +
                        '&Body=' + name + "様\n間もなく順番です。";

            kintone.proxy(url, 'POST', headers, data, function (body, status, headers) {
                if (status === 201) {
                    alert(name + '様へのSMSの送信が完了しました。');
                } else {
                    alert(name + '様へのSMSの送信に失敗しました。¥n' + status + '¥n' + body);
                }
            });
        }


        // 呼び出し処理
        function dial(event) {

            // レコードから名前と電話番号を取得
            var rec = kintone.app.record.get();
            var name = rec.record.name.value;
            var tel_to = rec.record.tel.value;

            // Twilio APIのURL
            var url = "https://" + ACCOUNT_SID + ":" + AUTH_TOKEN + 
                    "@api.twilio.com/2010-04-01/Accounts/" + ACCOUNT_SID + "/Calls.json";
            // HTTPヘッダー
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'};

            // 発信先の電話番号（トライアルアカウントの場合は検証済み電話番号のみ発信可能なので注意）
            // 入力されたパターンに応じてプレフィックスをつける。
            // 
            if ((" " + tel_to).indexOf(" 0") !== -1) {
                tel_to = (" " + tel_to).replace(/ 0/g, "+81");
            } else if ((" " + tel_to).indexOf(" +") === -1){
                tel_to = "+" + tel_to;
            }

            // TwiMLを生成
            var twiMl = '<Response><Say voice="woman" language="ja-jp">' + 
                    name + '様。予約の順番が来ました。カウンターまでお越しください。</Say></Response>';
            // Twimletsを利用して、TwiMLのURLを生成
            var twiMlUrl = 'http://twimlets.com/echo?Twiml='+encodeURIComponent(twiMl);
            
            // 送信データ
            var data = 'From='+encodeURIComponent(FROM_DIAL) +
                        '&To='+encodeURIComponent(tel_to) +
                        '&Url='+encodeURIComponent(twiMlUrl);
    
            kintone.proxy(url, 'POST', headers, data, function (body, status, headers) {
                if (status === 201) {
                    alert(name + '様への呼び出しが完了しました。');
                } else {
                    alert(name + '様への呼び出しが失敗しました。¥n' + status + '¥n' + body);
                }
            });
        }

    });

})();
