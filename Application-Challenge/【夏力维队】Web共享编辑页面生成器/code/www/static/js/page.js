// Generated by CoffeeScript 1.12.7
(function() {
  var Hs, WS_DEVICE, formatDate, formatDateAll, hotpoor_timestamp, hotpoor_ws, hotpoor_ws_device, root,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Hs || (root.Hs = {});

  Hs = root.Hs;

  Hs.DEVICE_USER = null;

  hotpoor_ws = null;

  hotpoor_timestamp = null;

  hotpoor_ws_device = null;

  WS_DEVICE = {
    UNKNOWN: 0,
    READY: 1,
    OPEN: 2,
    POST: 3,
    BAD: 4
  };

  formatDate = function(now) {
    var audio_list_time_now, date, hour, minute, month, now_date, year;
    now_date = new Date(now);
    audio_list_time_now = new Date();
    year = now_date.getFullYear();
    month = now_date.getMonth() + 1;
    date = now_date.getDate();
    hour = now_date.getHours();
    minute = now_date.getMinutes();
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (audio_list_time_now.getFullYear() === year && audio_list_time_now.getMonth() + 1 === month && audio_list_time_now.getDate() === date) {
      return hour + ":" + minute;
    }
    if (audio_list_time_now.getFullYear() === year) {
      return month + "/" + date + "/" + year;
    }
    return month + "/" + date + "/" + year;
  };

  formatDateAll = function(now) {
    var audio_list_time_now, date, hour, minute, month, now_date, year;
    now_date = new Date(now);
    audio_list_time_now = new Date();
    year = now_date.getFullYear();
    month = now_date.getMonth() + 1;
    date = now_date.getDate();
    hour = now_date.getHours();
    minute = now_date.getMinutes();
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (audio_list_time_now.getFullYear() === year && audio_list_time_now.getMonth() + 1 === month && audio_list_time_now.getDate() === date) {
      return hour + ":" + minute;
    }
    if (audio_list_time_now.getFullYear() === year) {
      return month + "月" + date + "日 " + hour + ":" + minute;
    }
    return year + "年" + month + "月" + date + "日 " + hour + ":" + minute;
  };

  $(function() {
    var device_uuid, hotpoor_ws_device_open, hotpoor_ws_timer, restart_ws_connection;
    console.log("page");
    if (typeof BLOCK_ID !== "undefined" && BLOCK_ID !== null) {
      hotpoor_ws_device = WS_DEVICE.UNKNOWN;
      hotpoor_ws_device_open = false;
      hotpoor_ws_timer = null;
      restart_ws_connection = function() {
        var on_message;
        console.log("restart_ws_connection");
        on_message = function(params) {
          var content_json, m_aim, m_plus, m_type;
          m_type = params[0];
          content_json = params[1];
          m_plus = "";
          m_aim = params[2];
          if (m_type === "COMMENTPAGEUPDATEDOM") {
            return page_dom(content_json);
          } else if (m_type === "COMMENTPAGEUPDATEDOMS") {
            return page_doms(content_json);
          } else if (m_type === "COMMENTPAGEUPDATEDOMCONTENT") {
            return page_dom_content(content_json);
          } else if (m_type === "COMMENTPAGEUPDATEDOMVIDEO") {
            return page_dom_video(content_json);
          } else if (m_type === "COMMENTPAGEADDDOM") {
            return page_dom_add(content_json);
          } else if (m_type === "COMMENTPAGEDELDOM") {
            return page_dom_del(content_json);
          } else if (m_type === "COMMENTPAGEPERMISSION") {
            return page_permission(content_json);
          } else if (m_type === "COMMENTPAGEADDEDITOR" || m_type === "COMMENTPAGEDELEDITOR") {
            return page_editor_change(content_json);
          } else if (m_type === "COMMENTPAGEUPDATEDOMIFRAME") {
            return page_dom_iframe(content_json);
          } else if (m_type === "COMMENTPAGEUPDATETITLE") {
            return page_title(content_json);
          } else if (m_type === "COMMENTPAGEUPDATEDESC") {
            return page_desc(content_json);
          } else if (m_type === "COMMENTPAGEGRIDGRAPH") {
            return page_grid_graph(content_json);
          } else if (m_type === "COMMENTPAGEMAINAREA") {
            return page_main_area(content_json);
          } else if (m_type === "COMMENTPAGECOPYDOM") {
            return page_dom_copy(content_json);
          } else if (m_type === "COMMENTPAGECOPYDOMS") {
            return page_doms_copy(content_json);
          }
        };
        if ("WebSocket" in window && hotpoor_ws_device === WS_DEVICE.UNKNOWN) {
          if (hotpoor_ws != null) {
            hotpoor_ws.close();
          }
          hotpoor_ws = new WebSocket(WEBSOCKET_URL);
          hotpoor_ws_device = WS_DEVICE.READY;
          hotpoor_ws.onopen = function() {
            if (hotpoor_ws_device !== WS_DEVICE.POST) {
              hotpoor_ws_device = WS_DEVICE.OPEN;
              hotpoor_ws_device_open = true;
              return console.log("开启hotpoor_ws成功，加载列表页");
            }
          };
          hotpoor_ws.onmessage = function(evt) {
            var params;
            if (hotpoor_ws_device !== WS_DEVICE.POST) {
              params = JSON.parse(evt.data);
              on_message(params);
            }
            return console.log("ws 收到消息");
          };
          hotpoor_ws.onclose = function() {
            console.log("hotpoor_ws_device:" + hotpoor_ws_device);
            if (hotpoor_ws_device !== WS_DEVICE.POST) {
              if (hotpoor_ws_device === WS_DEVICE.OPEN || hotpoor_ws_device === WS_DEVICE.READY) {
                hotpoor_ws_device = WS_DEVICE.UNKNOWN;
                console.log("wait");
                if (hotpoor_ws_timer) {
                  clearTimeout(hotpoor_ws_timer);
                }
                if (USER_ID) {
                  return hotpoor_ws_timer = setTimeout(restart_ws_connection(), 500);
                }
              } else {
                return hotpoor_ws_device = WS_DEVICE.BAD;
              }
            }
          };
          hotpoor_ws.onerror = function() {
            return console.log("ws error");
          };
          if (hotpoor_ws_timer) {
            clearTimeout(hotpoor_ws_timer);
          }
          if (USER_ID) {
            return hotpoor_ws_timer = setTimeout(restart_ws_connection, 3000);
          }
        } else {
          if (hotpoor_ws_device_open) {
            if (hotpoor_ws_timer) {
              clearTimeout(hotpoor_ws_timer);
            }
            if (USER_ID) {
              hotpoor_ws_timer = setTimeout(restart_ws_connection, 3000);
            }
          }
        }
      };
      restart_ws_connection();
    }
    root.page_dom_content_self = function(content_json, key, key_item) {
      var d, uuid2_now;
      if (typeof content_json[key] === "string") {
        try {
          uuid2_now = JSON.parse(content_json[key])[key_item];
        } catch (error) {
          d = error;
          return false;
        }
      } else {
        uuid2_now = content_json[key][key_item];
      }
      if (indexOf.call(root.uuid2s, uuid2_now) >= 0) {
        root.uuid2s.pop(uuid2_now);
        return true;
      }
      return false;
    };
    root.page_doms_copy = function(content_jsons) {
      var action_ids, content_json_content, fn, i, len, page_doms_copy_items, ref;
      page_doms_copy_items = [];
      ref = content_jsons["content"];
      fn = function(content_json_content) {
        var new_content_json;
        console.log("page_doms_copy");
        new_content_json = content_jsons;
        new_content_json["content"] = content_json_content;
        return page_dom_copy(new_content_json);
      };
      for (i = 0, len = ref.length; i < len; i++) {
        content_json_content = ref[i];
        page_doms_copy_items.push(content_json_content["dom_current"]);
        fn(content_json_content);
      }
      action_ids = "#" + (page_doms_copy_items.join(",#"));
      $(".card_more_selected").removeClass("card_more_selected");
      return $(action_ids).find(".card_more_select").click();
    };
    root.page_dom_copy = function(content_json) {
      return page_dom_add(content_json, true, function(content_json) {
        return (function(content_json) {
          var main_content;
          main_content = content_json["content"];
          if (main_content["dom_type"] === "iframe") {
            return page_dom_iframe(content_json, true, function(content_json) {
              return page_dom(content_json);
            });
          } else if (main_content["dom_type"] === "text") {
            return page_dom_content(content_json, true, function(content_json) {
              return page_dom(content_json);
            });
          } else if (main_content["dom_type"] === "video") {
            return page_dom_video(content_json, true, function(content_json) {
              return page_dom(content_json);
            });
          } else {
            return page_dom(content_json);
          }
        })(content_json);
      });
    };
    root.page_doms = function(content_json) {
      var i, len, main_content, ref, results, update;
      if (page_dom_content_self(content_json["content"], "dom_content", "uuid")) {
        console.log("self");
      }
      main_content = content_json["content"];
      console.log(main_content);
      ref = main_content["updates"];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        update = ref[i];
        results.push($("#" + update["dom_id"]).animate({
          "left": update["x"],
          "top": update["y"]
        }));
      }
      return results;
    };
    root.page_dom = function(content_json) {
      var dom, dom_h, dom_id, dom_s, dom_w, dom_x, dom_y, dom_z, main_content;
      console.log("page_dom");
      console.log(content_json);
      main_content = content_json["content"];
      dom_id = main_content["dom_current"];
      dom_x = main_content["dom_position_x"];
      dom_y = main_content["dom_position_y"];
      dom_w = main_content["dom_position_w"];
      dom_h = main_content["dom_position_h"];
      dom_z = main_content["dom_position_z"];
      dom_s = main_content["dom_scroll"];
      dom = $("#" + dom_id);
      if ($("#" + dom_id).hasClass("dom_video")) {
        $("#player_" + dom_id).css({
          "width": dom_w,
          "height": dom_h
        });
      } else if ($("#" + dom_id).hasClass("dom_iframe")) {
        $("#" + dom_id + ">.sections>.section>iframe").css({
          "width": dom_w,
          "height": dom_h
        });
      }
      if (dom.hasClass("self-editing")) {
        return;
      }
      if (dom_s === "") {
        if ($("#" + dom_id).hasClass("dom_scroll_auto")) {
          $("#" + dom_id).removeClass("dom_scroll_auto");
        }
      } else {
        $("#" + dom_id).addClass(dom_s);
      }
      $("#" + dom_id).css({
        "width": dom_w,
        "height": dom_h
      });
      $("#" + dom_id).animate({
        "left": dom_x,
        "top": dom_y,
        "zIndex": dom_z
      }, 500);
      return $("#" + dom_id + ">.z_index_num").text(dom_z);
    };
    root.page_dom_content = function(content_json, copy, callback) {
      var a, b, b_html;
      if (copy == null) {
        copy = false;
      }
      if (callback == null) {
        callback = null;
      }
      if (page_dom_content_self(content_json["content"], "dom_content", "uuid")) {
        console.log("self");
      } else {
        if (copy) {
          b = content_json["content"]["dom_content"];
          b_html = b;
          b["dom_id"] = content_json["content"]["dom_current"];
        } else {
          b = JSON.parse(content_json["content"]["dom_content"]);
          b_html = b["text"];
        }
        a = $("#" + b["dom_id"] + ">.sections").html(b_html);
      }
      if (copy) {
        return callback(content_json);
      }
    };
    root.page_dom_video = function(content_json, copy, callback) {
      var b, h, main_content, vt, w;
      if (copy == null) {
        copy = false;
      }
      if (callback == null) {
        callback = null;
      }
      main_content = content_json["content"];
      if (copy) {
        b = content_json["content"]["dom_content"];
        b["dom_id"] = main_content["dom_current"];
        b["text"] = {
          "src": b["src"],
          "type": b["type"],
          "poster": b["poster"]
        };
      } else {
        b = JSON.parse(content_json["content"]["dom_content"]);
      }
      w = $("#" + b["dom_id"]).width();
      h = $("#" + b["dom_id"]).height();
      $("#player_" + b["dom_id"]).remove();
      vt = uuid2(6, null);
      $(".novideospan").remove();
      $("#" + b['dom_id'] + ">.sections>.section").prepend("<video id=\"player_" + b["dom_id"] + "\" data-vt=\"" + vt + "\" width=\"" + w + "\" height=\"" + h + "\" class=\"video-js vjs-default-skin\" poster=\"" + b["text"]["poster"] + "\"\n        controls\n        webkit-playsinline=\"true\"\n        playsinline=\"true\">\n    <source src=\"" + b["text"]["src"] + "\" type=\"" + b["text"]["type"] + "\">\n    <!-- .m3u8 application/x-mpegURL -->\n</video>");
      videojs("#player_" + b["dom_id"] + "[data-vt=" + vt + "]");
      if (PAGE_TYPE === "page_edit") {
        $("#" + b['dom_id'] + ">.sections>.section>div>.video_src").val(b["text"]["src"]);
        $("#" + b['dom_id'] + ">.sections>.section>div>.video_type").val(b["text"]["type"]);
        $("#" + b['dom_id'] + ">.sections>.section>div>.video_poster").val(b["text"]["poster"]);
      }
      if (copy) {
        return callback(content_json);
      }
    };
    root.page_dom_iframe = function(content_json, copy, callback) {
      var b, h, iframe_html, iframe_tools, main_content, w;
      if (copy == null) {
        copy = false;
      }
      if (callback == null) {
        callback = null;
      }
      main_content = content_json["content"];
      if (copy) {
        console.log(main_content);
        console.log("========");
        b = main_content["dom_content"];
        iframe_html = b["html"];
        b["dom_id"] = main_content["dom_current"];
        console.log(b["dom_id"]);
      } else {
        b = JSON.parse(main_content["dom_content"]);
        iframe_html = b["text"]["html"];
      }
      console.log(iframe_html);
      w = $("#" + b["dom_id"]).width();
      h = $("#" + b["dom_id"]).height();
      if (PAGE_TYPE === "page_edit") {
        iframe_tools = $("#" + b['dom_id'] + ">.sections>.section>.iframe_tool");
      }
      $("#" + b['dom_id'] + ">.sections>.section>iframe").remove();
      $("#" + b['dom_id'] + ">.sections>.section").empty();
      $("#" + b['dom_id'] + ">.sections>.section").prepend("" + iframe_html);
      $("#" + b['dom_id'] + ">.sections>.section>iframe").css({
        "width": w,
        "height": h
      });
      if (PAGE_TYPE === "page_edit") {
        $("#" + b['dom_id'] + ">.sections>.section").append(iframe_tools);
        console.log("===iframe_html 1===");
        console.log(iframe_html);
        console.log("===iframe_html 2===");
        console.log("#" + b['dom_id'] + ">.sections>.section>div>.iframe_html");
        $("#" + b['dom_id'] + ">.sections>.section>div>.iframe_html").val(iframe_html);
      }
      if (copy) {
        return callback(content_json);
      }
    };
    root.page_main_area = function(content_json) {
      var _h, _w, b, main_content;
      main_content = content_json["content"];
      if (page_dom_content_self(main_content, "dom_content", "uuid")) {
        console.log("self");
        return;
      }
      if (typeof content_json["content"]["dom_content"] === "string") {
        b = JSON.parse(content_json["content"]["dom_content"]);
      } else {
        b = content_json["content"]["dom_content"];
      }
      _w = parseInt(b["text"]["w"]);
      _h = parseInt(b["text"]["h"]);
      if (PAGE_TYPE === "page_edit" || PAGE_TYPE === "page") {
        return $(".main_area").css({
          "width": _w + "px",
          "height": _h + "px"
        });
      }
    };
    root.page_grid_graph = function(content_json) {
      var _h, _w, b, main_content;
      main_content = content_json["content"];
      if (page_dom_content_self(main_content, "dom_content", "uuid")) {
        console.log("self");
        return;
      }
      if (typeof content_json["content"]["dom_content"] === "string") {
        b = JSON.parse(content_json["content"]["dom_content"]);
      } else {
        b = content_json["content"]["dom_content"];
      }
      _w = parseInt(b["text"]["w"]) * 2;
      _h = parseInt(b["text"]["h"]) * 2;
      if (PAGE_TYPE === "page_edit") {
        return $("body").css({
          "backgroundSize": _w + "px " + _h + "px"
        });
      }
    };
    root.page_title = function(content_json) {
      var b, main_content, title, title_list, title_tag;
      main_content = content_json["content"];
      if (page_dom_content_self(main_content, "dom_content", "uuid")) {
        console.log("self");
        return;
      }
      b = JSON.parse(content_json["content"]["dom_content"]);
      title = b["title"];
      if (PAGE_TYPE === "page_edit") {
        $(".top_area_info_title").val(title);
        title_tag = "Page Edit |";
      } else {
        title_tag = "Page |";
      }
      title_list = window.document.title.split(title_tag);
      title_list[0] = title + " | ";
      return window.document.title = title_list.join(title_tag);
    };
    root.page_desc = function(content_json) {
      var b, block_desc_content_old, desc, main_content;
      main_content = content_json["content"];
      if (page_dom_content_self(main_content, "dom_content", "uuid")) {
        console.log("self");
        return;
      }
      b = JSON.parse(content_json["content"]["dom_content"]);
      desc = b["desc"];
      if (PAGE_TYPE === "page_edit") {
        block_desc_content_old = desc;
        return $(".block_desc_content").val(desc);
      }
    };
    root.page_dom_add = function(content_json, copy, callback) {
      var dom_content, dom_current, dom_h, dom_type, dom_w, dom_x, dom_y, dom_z, html, html_control, main_content;
      if (copy == null) {
        copy = false;
      }
      if (callback == null) {
        callback = null;
      }
      main_content = content_json["content"];
      dom_current = main_content["dom_current"];
      dom_content = main_content["dom_content"];
      dom_x = main_content["dom_position_x"];
      dom_y = main_content["dom_position_y"];
      dom_w = main_content["dom_position_w"];
      dom_h = main_content["dom_position_h"];
      dom_z = main_content["dom_position_z"];
      dom_type = main_content["dom_type"];
      if (PAGE_TYPE === "page_edit") {
        if (dom_type === "video") {
          dom_content = "<div class=\"section\" contenteditable=\"false\">\n    <div>video_src:<input class=\"video_src\"></div>\n    <div>video_type:<input class=\"video_type\"></div>\n    <div>video_poster:<input class=\"video_poster\"></div>\n    <div>\n        <button class=\"video_add\">upload video</button>\n        <button class=\"video_save\">save</button>\n    </div>\n</div>";
        } else if (dom_type === "iframe") {
          dom_content = "<div class=\"section\" contenteditable=\"false\">\n    <div class=\"iframe_tool\"><textarea class=\"iframe_html\" placeholder=\"/* html code */\"></textarea></div>\n    <div class=\"iframe_tool\"><button class=\"iframe_save\">save</button></div>\n</div>";
        }
        html_control = "<div class=\"card_move\"></div>\n<div class=\"card_more_select\"></div>\n<div class=\"card_copy\"></div>\n<div class=\"card_del\"></div>\n<div class=\"resize_btn\"></div>\n<div class=\"card_z_index z_index_max\"></div>\n<div class=\"card_z_index z_index_up\"></div>\n<div class=\"card_z_index z_index_down\"></div>\n<div class=\"card_z_index z_index_min\"></div>\n<div class=\"card_z_index z_index_num\">" + dom_z + "</div>\n<div class=\"card_scroll_auto\">\n    <div class=\"card_scroll_auto_svg\"></div>\n</div>\n<div class=\"card_text_align text_align_left\"></div>\n<div class=\"card_text_align text_align_center\"></div>\n<div class=\"card_text_align text_align_right\"></div>\n<div class=\"card_font_size font_size_big\"></div>\n<div class=\"card_font_size font_size_small\"></div>\n<div class=\"card_font_color\">\n    <div class=\"card_font_color_demo\">\n    </div>\n</div>";
        html = "<div    id=\"" + dom_current + "\" class=\"card dom dom_" + dom_type + "\" \n            data-tree=\"" + dom_current + "\" \n            style=\"\n            left: " + dom_x + "px;\n            top: " + dom_y + "px;\n            width: " + dom_w + "px;\n            height: " + dom_h + "px;\n            z-index: " + dom_z + ";\n            \">\n            <style></style>\n        <div class=\"sections\" contenteditable=\"true\">\n            " + dom_content + "\n        </div>\n        " + html_control + "\n</div>";
      } else {
        if (dom_type === "video") {
          dom_content = "<div class=\"section\" contenteditable=\"false\"><span class=\"novideospan\">视频未设置</span></div>";
        } else if (dom_type === "iframe") {
          dom_content = "<div class=\"section\" contenteditable=\"false\">iframe暂未设置</div>";
        }
        html_control = "<div class=\"card_move hide\"></div>\n<div class=\"card_more_select hide\"></div>\n<div class=\"card_copy hide\"></div>\n<div class=\"card_del hide\"></div>\n<div class=\"resize_btn hide\"></div>";
        html = "<div    id=\"" + dom_current + "\" class=\"card dom dom_" + dom_type + "\" \n            data-tree=\"" + dom_current + "\" \n            style=\"\n            left: " + dom_x + "px;\n            top: " + dom_y + "px;\n            width: " + dom_w + "px;\n            height: " + dom_h + "px;\n            z-index: " + dom_z + ";\n            \">\n            <style></style>\n        <div class=\"sections\">\n            " + dom_content + "\n        </div>\n        " + html_control + "\n</div>";
      }
      $(".main_area").append(html);
      if (copy) {
        return callback(content_json);
      }
    };
    root.page_dom_del = function(content_json) {
      var dom_current, main_content;
      main_content = content_json["content"];
      dom_current = main_content["dom_current"];
      return $("#" + dom_current).remove();
    };
    root.page_permission = function(content_json) {
      var main_content;
      main_content = content_json["content"];
      if (main_content["action"] === "reload page") {
        return window.location.reload();
      }
    };
    root.page_editor_change = function(content_json) {
      var main_content;
      main_content = content_json["content"];
      if (main_content["aim_user_id"] === USER_ID) {
        return window.location.reload();
      } else {
        if (main_content["action"] === "add editor") {
          return load_users(["editors"]);
        } else if (main_content["action"] === "del editor") {
          return load_users(["editors"]);
        }
      }
    };
    root.load_users = function(groups) {
      var group, i, len, results;
      results = [];
      for (i = 0, len = groups.length; i < len; i++) {
        group = groups[i];
        results.push((function(group) {
          return $.ajax({
            url: "/api/page/" + group,
            data: {
              block_id: BLOCK_ID
            },
            dataType: 'json',
            type: 'GET',
            success: function(data) {
              console.log(JSON.stringify(data));
              return $(".block_" + group + "_list").text(data[group]);
            },
            error: function(data) {
              return console.log(data);
            }
          });
        })(group));
      }
      return results;
    };
    root.load_users(["editors", "readers", "blackers", "members"]);
    device_uuid = uuid2(6, null);
    Hs.DEVICE_USER = USER_ID + "_" + device_uuid;
    return console.log(Hs.DEVICE_USER);
  });

}).call(this);
