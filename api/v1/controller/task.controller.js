const Task = require("../model/task.model");
const User = require("../model/user.model");

const paginationHelper = require("../../../helper/pagination.helper");
const searchHelper = require("../../../helper/search.helper");

// [GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  try {
    const find = {
      $or: [
        {
          createBy: req.user.id
        },
        {
          listUsers: req.user.id
        }
      ],
      deleted: false,
    }
    console.log(req.user.id);

    // filter status
    if (req.query.status) {
      find.status = req.query.status;
    }

    // sắp xếp theo tiêu chí  
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }

    // Pagination 
    const initPagination = {
      currentPagination: 1,
      limitRecord: 3,
    };
    const countRecord = await Task.countDocuments(find);
    objectPagination = paginationHelper(initPagination, req.query, countRecord);


    // Search
    if (req.query.keyword) {
      const objiectSeach = searchHelper(req.query)
      find.title = objiectSeach.regex;
    }

    const tasks = await Task.find(find)
      .sort(sort)
      .skip(objectPagination.skip)
      .limit(objectPagination.limitRecord);

    res.json(tasks);
  } catch (error) {
    res.json({
      code: "400",
      data: "Không tìm thấy"
    });
  }
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false
    });
    res.json(task);
  } catch (error) {
    res.json({
      code: "200",
      data: "Không tìm thấy"
    })
  }
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne({ _id: id, }, req.body);

    res.json({
      code: 200,
      message: "Thay đổi trạng thái thành công",
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy",
    })
  }
}

// [PATCH] /api/v1/tasks/change-multip
module.exports.changeMultip = async (req, res) => {
  try {
    const { id, key, value } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany({
          _id: { $in: id }
        }, {
          status: value
        });
        res.json({
          code: "200",
          message: "Cập nhập thành công"
        });
        break;
      case "delete":
        await Task.updateMany({
          _id: { $in: id }
        }, {
          deleted: true,
          deleteAt: Date.now()
        })
        res.json({
          code: "200",
          message: "Cập nhập thành công"
        });
        break
      default:
        res.json({
          code: "400",
          message: "Không tìm thấy"
        })
        break;
    }

  } catch (error) {
    res.json({
      code: "400",
      message: "Không tìm thấy"
    })
  }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createBy = req.user.id;
    const task = new Task(req.body);
    await task.save();

    res.json({
      code: "200",
      message: "Tạo mới thành công",
      data: task
    }
    )
  } catch (error) {
    res.json({
      code: "400",
      message: "Tạo mới thấy bại"
    });
  }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({ _id: id }, req.body);

    res.json({
      code: "200",
      message: "Chỉnh sửa thành công"
    })
  } catch (error) {
    res.json({
      code: "400",
      message: "Chỉnh sửa thất bại"
    })
  }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({
      _id: id
    }, {
      deleted: true,
      deleteAt: Date.now(),
    });
    res.json({
      code: "200",
      message: "Xoá thành công"
    })

  } catch (error) {
    res.json({
      code: "400",
      message: "Xoá thất bại"
    });
  }
}

// [PATCH] /api/v1/tasks/undo/:id
module.exports.undo = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({
      _id: id,
      deleted: true
    }, {
      deleted: false
    });

    res.json({
      code: "200",
      message: "Hoàn tác thành công"
    })
  } catch (error) {
    res.json({
      code: "400",
      message: "Hoàn tác thất bại"
    });
  }
}

// [GET] /api/v1/tasks/list
module.exports.list = async (req, res) => {
  try {
    const users = await User.find({
      deleted: false
    }).select("id fullName");

    res.json({
      code: "200",
      message: "Success",
      users: users
    })
  } catch (error) {
    res.json({
      code: "400",
      message: "Error"
    })
  }
}