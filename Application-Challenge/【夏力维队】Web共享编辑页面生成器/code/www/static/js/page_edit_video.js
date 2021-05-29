// Generated by CoffeeScript 1.12.7
(function() {
  var Hs, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Hs || (root.Hs = {});

  Hs = root.Hs;

  $(function() {
    var CDN_PREFIX, current_dom_sections, current_dom_video_poster, current_dom_video_save, current_dom_video_src, current_dom_video_type, file_lists, handleFileSelect1;
    CDN_PREFIX = "http://fm-of-test0.xialiwei.com";
    file_lists = [];
    current_dom_video_src = null;
    current_dom_video_save = null;
    current_dom_video_type = null;
    current_dom_video_poster = null;
    current_dom_sections = null;
    if (window.File && window.FileList && window.FileReader && window.Blob && window.Worker) {
      handleFileSelect1 = function(evt) {
        var _room_id, content_type, endingByte, file_index, files, img_add, ref, startingByte, uploadFile;
        img_add = (ref = $(this).attr("id") === "video_add_upload") != null ? ref : {
          "true": false
        };
        _room_id = BLOCK_ID;
        content_type = "HQWEBVIDEO//";
        evt.stopPropagation();
        evt.preventDefault();
        files = null;
        if (evt.target.files) {
          files = evt.target.files;
        } else {
          files = evt.dataTransfer.files;
        }
        file_lists.push(files);
        file_index = 0;
        startingByte = 0;
        endingByte = 0;
        console.log("video coffee");
        console.log(BLOCK_ID);
        uploadFile = function(file) {
          var loading_flag, reader, ref1, tempfile, type, updateProgress, uploadNextFile, xhrProvider;
          if (file === void 0) {
            return;
          }
          if (file.type === void 0) {
            return;
          }
          type = file.type ? file.type : 'n/a';
          console.log(type);
          current_dom_video_type.val(type);
          if (!((ref1 = type.split("/")[0]) === "video")) {
            file_index += 1;
            alert("文件格式不支持");
            return;
          }
          reader = new FileReader();
          tempfile = null;
          startingByte = 0;
          console.log("正在上传第一个视频");
          loading_flag = uuid2(6, null);
          current_dom_sections.append("<div id=\"loading_" + loading_flag + "\" class=\"loading_flag\" contenteditable=\"false\"></div>");
          $("#loading_" + loading_flag).animate({
            "width": "25%"
          }, 1000);
          xhrProvider = function() {
            var xhr;
            xhr = jQuery.ajaxSettings.xhr();
            if (xhr.upload) {
              xhr.upload.addEventListener('progress', updateProgress, false);
            }
            return xhr;
          };
          updateProgress = function(evt) {
            return console.log("Uploading file " + (file_index + 1) + " of " + files.length + " at " + ((startingByte + (endingByte - startingByte) * evt.loaded / evt.total) / file.size * 100) + "%");
          };
          uploadNextFile = function() {
            var obj;
            console.log("正在要上传下一个视频");
            file_index += 1;
            if (file_index < files.length) {
              uploadFile(files[file_index]);
              console.log("===");
              console.log(file_index);
              return console.log("===|||");
            } else {
              file_lists.shift();
              if (file_lists.length > 1) {
                file_index = 0;
                files = file_lists[0];
                uploadFile(files[file_index]);
                console.log("===+++");
                console.log(file_index);
                return console.log("===|||");
              } else {
                console.log("===>>>");
                obj = document.getElementById('video_add_upload');
                return obj.outerHTML = obj.outerHTML;
              }
            }
          };
          reader.onload = function(evt) {
            var bin, content, worker;
            content = evt.target.result.slice(evt.target.result.indexOf("base64,") + 7);
            bin = atob(content);
            worker = new Worker("/static/js/md5.js");
            worker.onmessage = function(event) {
              var Qiniu_UploadUrl, Qiniu_UploadUrl_https, md5, worker_aim_url;
              md5 = event.data;
              Qiniu_UploadUrl_https = "https://up-z1.qiniup.com";
              if (window.location.protocol === "https:") {
                Qiniu_UploadUrl = Qiniu_UploadUrl_https;
              } else {
                Qiniu_UploadUrl = "http://up-z1.qiniup.com";
              }
              worker_aim_url = "/api/video/check";
              return $.post(worker_aim_url, {
                "block_id": _room_id,
                "md5": md5
              }, function(data) {
                var Qiniu_upload, obj, result_url, upload_token;
                if (files.length === 1) {
                  console.log("正在上传1个视频");
                  if (data["exists"]) {
                    result_url = CDN_PREFIX + "/" + BLOCK_ID + "_v_" + md5;
                    current_dom_video_src.val(result_url);
                    current_dom_video_poster.val(result_url + "?vframe/jpg/offset/0/");
                    $("#loading_" + loading_flag).animate({
                      "width": "100%"
                    }, 500, function() {
                      $("#loading_" + loading_flag).remove();
                      return current_dom_video_save.click();
                    });
                    obj = document.getElementById('video_add_upload');
                    obj.outerHTML = obj.outerHTML;
                    return;
                  }
                } else {
                  if (file_index + 1 === files.length) {
                    console.log("正在上传最后一个视频");
                    if (data["exists"]) {
                      result_url = CDN_PREFIX + "/" + BLOCK_ID + "_v_" + md5;
                      current_dom_video_src.val(result_url);
                      current_dom_video_poster.val(result_url + "?vframe/jpg/offset/0/");
                      $("#loading_" + loading_flag).animate({
                        "width": "100%"
                      }, 500, function() {
                        $("#loading_" + loading_flag).remove();
                        return current_dom_video_save.click();
                      });
                      obj = document.getElementById('video_add_upload');
                      obj.outerHTML = obj.outerHTML;
                      return;
                    }
                  } else {
                    console.log("正在上传" + (file_index + 1) + "/" + files.length + "个视频");
                    if (data["exists"]) {
                      result_url = CDN_PREFIX + "/" + BLOCK_ID + "_v_" + md5;
                      if (file_index === 0) {
                        current_dom_video_src.val(result_url);
                        current_dom_video_poster.val(result_url + "?vframe/jpg/offset/0/");
                        $("#loading_" + loading_flag).animate({
                          "width": "100%"
                        }, 500, function() {
                          $("#loading_" + loading_flag).remove();
                          return current_dom_video_save.click();
                        });
                      } else {
                        current_dom_video_src.val(result_url);
                        current_dom_video_poster.val(result_url + "?vframe/jpg/offset/0/");
                        $("#loading_" + loading_flag).animate({
                          "width": "100%"
                        }, 500, function() {
                          $("#loading_" + loading_flag).remove();
                          return current_dom_video_save.click();
                        });
                      }
                      return uploadNextFile();
                    }
                  }
                }
                upload_token = data["token"];
                Qiniu_upload = function(f, token, key) {
                  var formData, startDate, xhr;
                  xhr = new XMLHttpRequest();
                  xhr.open('POST', Qiniu_UploadUrl, true);
                  formData = new FormData();
                  if (key !== null && key !== void 0) {
                    formData.append('key', key);
                  }
                  formData.append('token', token);
                  formData.append('file', f);
                  xhr.upload.addEventListener("progress", function(evt) {
                    var formatSpeed, nowDate, percentComplete, taking, uploadSpeed, x, y;
                    if (evt.lengthComputable) {
                      nowDate = new Date().getTime();
                      taking = nowDate - startDate;
                      x = evt.loaded / 1024;
                      y = taking / 1000;
                      uploadSpeed = x / y;
                      if (uploadSpeed > 1024) {
                        formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
                      } else {
                        formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                      }
                      percentComplete = Math.round(evt.loaded * 100 / evt.total);
                      console.log(percentComplete, ",", formatSpeed);
                      return $("#loading_" + loading_flag).css({
                        "width": (25 + percentComplete * 0.75) + "%"
                      });
                    }
                  }, false);
                  xhr.onreadystatechange = function(response) {
                    var blkRet;
                    if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText !== "") {
                      blkRet = JSON.parse(xhr.responseText);
                      return $.post("/api/video/add", {
                        "aim_id": _room_id,
                        "md5": md5
                      }, function() {
                        result_url = CDN_PREFIX + "/" + BLOCK_ID + "_v_" + md5;
                        current_dom_video_src.val(result_url);
                        current_dom_video_poster.val(result_url + "?vframe/jpg/offset/0/");
                        $("#loading_" + loading_flag).animate({
                          "width": "100%"
                        }, 500, function() {
                          $("#loading_" + loading_flag).remove();
                          return current_dom_video_save.click();
                        });
                        return uploadNextFile();
                      });
                    }
                  };
                  startDate = new Date().getTime();
                  return xhr.send(formData);
                };
                return Qiniu_upload(file, upload_token, _room_id + "_v_" + md5);
              });
            };
            return worker.postMessage(bin);
          };
          return reader.readAsDataURL(file);
        };
        if (file_lists.length >= 1) {
          return uploadFile(files[file_index]);
        }
      };
      $("body").on("change", "#video_add_upload", handleFileSelect1);
      return $("body").on("click", ".dom_video>.sections>.section>div>.video_add", function(evt) {
        var dom_sections, dom_video_add;
        dom_video_add = $(this);
        dom_sections = dom_video_add.parents(".sections");
        current_dom_video_src = dom_video_add.parents(".section").find(".video_src");
        current_dom_video_poster = dom_video_add.parents(".section").find(".video_poster");
        current_dom_video_type = dom_video_add.parents(".section").find(".video_type");
        current_dom_video_save = dom_video_add.parents(".section").find(".video_save");
        current_dom_sections = dom_sections;
        return $("#video_add_upload").click();
      });
    }
  });

}).call(this);
