// ==UserScript==
// @name         Ages-Past
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  add quicklinks
// @author       Snebulan
// @match        http://www.ages-past.net/*
// @match        https://www.ages-past.net/*
// @match        ages-past.net/*
// @match        https://ages-past.net/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

$(document).ready(function(){
    //Settings
    var settings = {
        user_id:null, // Change to your userID
        heal_link:true,
        refill_link:true,
        bank_link:true,
        fountain_link:true,
        deposit_link:true,
        castle_link:true,
        donate_clan_link:true,
        show_clan_donate:true,
        v_days:false, // Change this according to if you have V-days or not (true/false). Will probably bug some things if not set correctly.
        set_rate:true,
    };
    var sharing = { // Only for people with Clan Armory permissions!
        enabled:true, // Change if you want it turned on/off (true/false)
        weapon_id:false, // Change this to the weapon ID you're using
        armor_id:false, // Change this to the armor ID you're using
    };

    var htmlt = '<table cellpadding="0" cellspacing="0" class="td" width="100%">';
    htmlt+= '<tbody><tr><td align="center" style="border-bottom: solid black 1px; height: 19px; background-image: url(images/skin/menu.jpg);"><b><font class="menu">Quick Access</font></b></td>';
    htmlt+= '</tr><tr>';
    htmlt+= '<td>';
    htmlt+= '<div id="test_box_yay" style="display:none;"></div>';
    if(settings.heal_link!==false) {
        htmlt+= '<a href="#" id="healAj">Heal</a>';
    }
    if(settings.refill_link!==false) {
        htmlt+= ' - <a href="#" id="refillAj">(Refill Jug)</a><br>';
    }
    if(settings.bank_link!==false) {
        htmlt+= '<a href="mensk_bank.php">Bank</a>';
    }
    if(settings.deposit_link!==false) {
        htmlt+= ' - <a href="#" id="depositAll">(Deposit All)</a><br>';
    }
    if(settings.fountain_link!==false) {
        htmlt+= '<a href="#" id="greatFountain">Fountain</a><br>';
    }
    if(settings.castle_link!==false) {
        htmlt+= '<a href="mensk_castle.php">Mensk Castle</a>';
    }
    if(settings.donate_clan_link!==false) {
        htmlt+= '<br><a href="#" id="clanD">Donate to clan</a>';
    }
    if(settings.set_rate!==false) {
        htmlt+= '<br><a href="#" id="setRage">Battle Booster</a>';
    }
    if(sharing.enabled!==false) {
        htmlt+= '<br><a href="#" id="retrieveEquip">Equip Possibility</a>';
    }
    //htmlt+= '<font color="green" id="qh_msg">&nbsp;</font><font id="aJmsg" style="display:none;">&nbsp;</font>';
    htmlt+= '</td></tr></tbody></table><br>';

    // Result Box
    htmlt+= '<table cellpadding="0" cellspacing="0" class="td" width="100%">';
    htmlt+= '<tbody><tr><td align="center" style="border-bottom: solid black 1px; height: 19px; background-image: url(images/skin/menu.jpg);"><b><font class="menu">Results</font></b></td>';
    htmlt+= '</tr><tr>';
    htmlt+= '<td>';
    htmlt+= '<div id="result_box" style="display:none;"></div>';
    htmlt+= '<font color="green" id="qh_msg">&nbsp;</font><font id="aJmsg" style="display:none;">&nbsp;</font>';
    htmlt+= '</td></tr></tbody></table><br>';
    // End Result Box

    $(htmlt).insertBefore($('.td')[2]);

    var EN = $('font.white')[5].innerHTML.split('/');
    $('#quickheal').html('<b>Time until max EN: '+EN_timer(EN[0],EN[1])+'</b>');

    function EN_timer(currEN,MaxEN) {
        var hours_left = (MaxEN-currEN)/10;
        var today = new Date();
        today.setHours(today.getHours() + Math.abs(hours_left));
        var dataTxt = today.toTimeString().split(' ')[0];
        if(hours_left>=24) {
            return '<br>'+Math.round((hours_left/24))+'d<br>'+(checkTime(today.getMonth()+1))+'-'+checkTime(today.getDate())+' '+today.getHours()+':00';
        } else {
            return '<br>'+hours_left+'h<br>'+(checkTime(today.getMonth()+1))+'-'+checkTime(today.getDate())+' '+today.getHours()+':00';
        }
    }

	function checkTime(i) {
		if (i<10) {
			i="0" + i;
		}
		return i;
	}

    $('#healAj').click(function() {
        var url = 'equipment.php?the_jug=true';
        $('#healAj').text('Healing');
        $.get(url, function( data ) {
            $('#healAj').text('Healed');
            var response = data.match(/<center>(.*?)<\/center>/g);
            $('#qh_msg').html(response[0]);
            var healed = response[0].match(/[0-9][0-9]*|0/g);
            if(healed !== null) {
                var beforeHealth = $('.white')[4].innerHTML.split('/');
                var currHealth = parseInt(beforeHealth[0]) + parseInt(healed);
                $('.white')[4].replaceWith(currHealth+'/'+beforeHealth[1]);
            }
        });
    });

    $('#refillAj').click(function() {
        var url = 'medical.php?action=refill';
        $('#refillAj').text('(Refilling)');
        $("#aJmsg").load(url+' #content-main-area', function(responseTxt, statusTxt, xhr){
            $('#qh_msg').html('<center>'+$('#aJmsg').text().split(')')[2]+'</center').show();
            $('#refillAj').text('(Refilled)');
        });
    });

    var eco = $('td')[10].innerHTML;
    eco = String(eco);
    var nums = eco.match(/[0-9][0-9]*|0/g);

    $('#depositAll').click(function() {
        $('#depositAll').text('(Depositing)');
        $.post("mensk_bank.php?action=deposit", {
            dcoins: nums[4],
            dbronze: nums[6],
            dsilver: nums[7],
            dgold: nums[8],
            dplatinum: nums[9]
        }).done(function( data ) {
            $('#depositAll').text('(Deposited)');
            $('#qh_msg').html('Deposited: '+nums[4]+' coins');
        });
    });

    $('#greatFountain').click(function() {
        var url = 'mensk_castle_fountain.php?action=steal';
        $('#greatFountain').text('Stealing');
        $("#aJmsg").load(url+' #content-main-area', function(responseTxt, statusTxt, hxr){
            console.log($('#aJmsg').html().split('<hr><br>')[1].split('<br><br><u>')[0]);
            $('#qh_msg').html($('#aJmsg').html().split('<hr><br>')[1].split('<br><br><u>')[0]);
        });
        $.get(url, function( data ) {
            $('#greatFountain').text('Stole');
        });
    });

    $('#clanD').click(function() {
        var coins = prompt("Please enter how much coins you wanna donate:", "");
        if(isInt1(coins) === true) {
            if(parseInt(coins)<=parseInt(nums[5]) && parseInt(coins) > 0) {
                $('#clanD').text('Withdrawing coins');
                $("#test_box_yay").load("mensk_bank.php #content-main-area", function() {
                    var token = $("input[name='token']").val();
                    $.post("mensk_bank.php?action=withdraw", {
                        dcoins: coins,
                        dbronze: 0,
                        dsilver: 0,
                        dgold: 0,
                        dplatinum: 0,
                        token: token
                    }).done(function( data ) {
                        $('#clanD').text('Withdrawn');
                        $.post("clan.php?view=donate&action=donate", {
                            coins: coins,
                            bronze: 0,
                            silver: 0,
                            gold: 0,
                            platinum: 0,
                            energy: 0,
                            shards: 0,
                        }).done(function(depos) {
                            $('#clanD').text('Donated to clan!');
                            $('#qh_msg').html('Donated <b>'+coins+'</b> coins to the clan!');
                        });
                    });
                });
            } else if(parseInt(coins) === 0) {
                alert('You can\'t donate 0 coins!');
            } else {
                alert('Not enough coins in the bank!');
            }
        } else {
            if(coins === null) {
                alert('Canceled!');
            } else {
                alert('NAN!');
            }
        }
    });

    $('#setRage').click(function() {
        var rage = prompt("Please enter how much booster you wanna set:", "");
        if(isInt1(rage) === true) {
            if(parseInt(rage) > 0) {
                $('#setRage').text('Setting Battle Rage');
                $.post("stats.php?view=boosters&action=submit_settings", {
                    battle_rage: rage,
                }).done(function( data ) {
                    $('#setRage').text('Battle Rage set').css({ 'font-weight': 'bold', 'color':'green' });
                });
            } else {
                alert('You can\'t set rage to 0 or less!');
            }
        } else {
            if(rage === null) {
                alert('Canceled!');
            } else {
                alert('NAN!');
            }
        }
    });

    $('#retrieveEquip').click(function() {
        if(confirm('You sure') === true) {
            $.post('clan.php?view=recall&action=retrieve', {
                'idw[]': sharing.weapon_id,
            }).done(function( data ) {
                $('#retrieveEquip').text('Returned to clan').css({ 'font-weight': 'bold', 'color':'red' });
                $.post('clan.php?view=equips&action=send', {
                    'wselllist[]': sharing.weapon_id,
                    id: settings.user_id,
                    type: 'lend',
                }).done(function( data ) {
                    $('#retrieveEquip').text('Sent to myself').css({ 'font-weight': 'bold', 'color':'yellow' });
                    $.get('equipment.php?equipwep='+sharing.weapon_id, {
                    }).done(function( data ) {
                        $('#retrieveEquip').text('Equipped').css({ 'font-weight': 'bold', 'color':'green' });
                    });
                });
            });
        } else {
            $('#retrieveEquip').text('Canceled').css({ 'font-weight': 'bold', 'color':'red' });
        }
    });

    function isInt1(value) {
        return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
    }

    var exp_numbers = [1, 3, 4, 5];
    percent(exp_numbers);
    function percent(n) {
        for (var i = 0; i < n.length; i++) {
            var x = $('font.white')[n[i]].innerHTML.split('/');
            var per = (x[0]/x[1]*100);
            var s = String(per).substring(0,4);
            $('font.white')[n[i]].append(' | '+s+'%');
        }
    }

    var xhm = '<br>';
    // Clan donation Box
    xhm+= '<table cellpadding="0" cellspacing="0" class="td" width="100%">';
    xhm+= '<tbody><tr><td align="center" style="border-bottom: solid black 1px; height: 19px; background-image: url(images/skin/menu.jpg);"><b><font class="menu">Clan Donation</font></b></td>';
    xhm+= '</tr><tr>';
    xhm+= '<td>';
    // Form
    xhm+= 'Coins: <input type="number" value="0" id="cd_coins">';
    xhm+= 'Plat: <input type="number" value="0" id="cd_plat">';
    xhm+= 'Bronze: <input type="number" value="0" id="cd_bronze">';
    xhm+= 'Silver: <input type="number" value="0" id="cd_silver">';
    xhm+= 'Gold: <input type="number" value="0" id="cd_gold"><br><br>';
    xhm+= 'From: <select id="donate_from"><option value="hand">On hand</option><option value="bank">Bank</option></select>';
    xhm+= '<input type="button" id="clan_donate" value="Donate">';
    // End Form
    xhm+= '<div id="donation_values" style="display:none;"></div>';
    xhm+= '<font color="green" id="">&nbsp;</font>';
    xhm+= '</td></tr></tbody></table><br>';
    // End Clan donation Box
    // Result Box
    xhm+= '<table cellpadding="0" cellspacing="0" class="td" width="100%">';
    xhm+= '<tbody><tr><td align="center" style="border-bottom: solid black 1px; height: 19px; background-image: url(images/skin/menu.jpg);"><b><font class="menu">Results</font></b></td>';
    xhm+= '</tr><tr>';
    xhm+= '<td>';
    xhm+= '<div id="clan_donations_val" style="display:none;"></div>';
    xhm+= '<font color="green" id="cd_result">&nbsp;</font>';
    xhm+= '</td></tr></tbody></table><br>';
    // End Result Box
    if(settings.show_clan_donate!==false) {
        $(xhm).insertAfter($('.td').last());
    }
    $('#clan_donate').click(function() {
        if($('#donate_from').val()==='hand') {
            $('#cd_result').text('Donating');
            $.post("clan.php?view=donate&action=donate", {
                coins: $('#cd_coins').val(),
                bronze: $('#cd_bronze').val(),
                silver: $('#cd_silver').val(),
                gold: $('#cd_gold').val(),
                platinum: $('#cd_plat').val(),
                energy: 0,
                shards: 0,
            }).done(function(depos) {
                var ress = 'Donated:<br>';
                ress+= '<b>'+$('#cd_coins').val()+'</b> coins,<br>';
                ress+= '<b>'+$('#cd_plat').val()+'</b> plat,<br>';
                ress+= '<b>'+$('#cd_bronze').val()+'</b> bronze,<br>';
                ress+= '<b>'+$('#cd_silver').val()+'</b> silver,<br>';
                ress+= '<b>'+$('#cd_gold').val()+'</b> gold';
                $('#cd_result').html(ress);
            });
        } else if($('#donate_from').val()==='bank') {
            $("#donation_values").load("mensk_bank.php #content-main-area", function() {
                $('#cd_result').text('Withdrawing');
                var token = $("input[name='token']").val();
                $.post("mensk_bank.php?action=withdraw", {
                    dcoins: $('#cd_coins').val(),
                    dbronze: $('#cd_bronze').val(),
                    dsilver: $('#cd_silver').val(),
                    dgold: $('#cd_gold').val(),
                    dplatinum: $('#cd_plat').val(),
                    token: token
                }).done(function( data ) {
                    $('#cd_result').text('Donating');
                    $.post("clan.php?view=donate&action=donate", {
                        coins: $('#cd_coins').val(),
                        bronze: $('#cd_bronze').val(),
                        silver: $('#cd_silver').val(),
                        gold: $('#cd_gold').val(),
                        platinum: $('#cd_plat').val(),
                        energy: 0,
                        shards: 0,
                    }).done(function(depos) {
                        var ress = 'Donated:<br>';
                        ress+= '<b>'+$('#cd_coins').val()+'</b> coins,<br>';
                        ress+= '<b>'+$('#cd_plat').val()+'</b> plat,<br>';
                        ress+= '<b>'+$('#cd_bronze').val()+'</b> bronze,<br>';
                        ress+= '<b>'+$('#cd_silver').val()+'</b> silver,<br>';
                        ress+= '<b>'+$('#cd_gold').val()+'</b> gold';
                        $('#cd_result').html(ress);
                    });
                });
            });
        } else {
            $('#cd_result').text('Something went wrong!');
        }
    });

    if(window.location.href.indexOf("coliseum.php") > -1) {
        var x = $('a:contains("[Attack]")');
        $.each(x, function( index, value ) {
            var b =' <a href="blackhand.php?view=spy&id='+value.href.split('=')[1]+'">Spy</a>';
            $(this).after(b);
        });
    }

    if(window.location.href.indexOf("clan.php?view=members") > -1) {
        var x =  $('a[href*="profile.php"]');
        var dataRow;
        $.each(x, function( index, value ) {
            var b =' <a href="clan.php?view=cashflow&id='+value.href.split('=')[1]+'">[Cashflow]</a>';
            $(this).after(b);
        });
        // Grab all cashflows
        if(settings.v_days!==false) { dataRow=11; } else { dataRow=10; }
        $('<br><a href="#" id="grablinks">Show all</a><br><div id="flow_c"></div>').insertAfter($('table')[dataRow]);
        $('#grablinks').click(function() {
            $.each(x, function( index, value ) {
                console.log(value);
                $.get('clan.php?view=cashflow&id='+value.href.split('=')[1], function(data) {
                    var who = $('center > b', data)[1];
                    var table;
                    if(settings.v_days!==false) { dataRow=9; } else { dataRow=8; }
                    table = $('table', data)[dataRow];
                    $('#flow_c').append(who);
                    $('#flow_c').append(table);
                });
            });
        });
    }

    if(window.location.href.indexOf("battle.php?id=") > -1) {
        $('#content-main-area font').filter(function(){
            if($(this).text().indexOf('Snebulan') !== 0 && $(this).text().indexOf('Double Striking!') !== 0) {
                if($(this).prev().text().indexOf('CRITICAL:') !== 0) {
                    $(this).removeClass('green');
                    $(this).addClass('red');
                }
            }
        });
    }

    function clean_up(alt) {
        $(alt+' a[href^="forum.php"]').each(function() {
            $(this).eq(0).attr('new_url',$(this)[0].href);
            $(this).eq(0).attr('href','#');
        });
        $(alt+' td[onclick^="javascript:location="]').each(function() {
            $(this).eq(0).attr('onclick','');
        });
    }

});