import asyncio
from scripts.database import USER_DATABASE


async def main():
    # 初始化数据库操作对象
    await USER_DATABASE.initialize()
    # 查询并打印 users 表的全部数据
    await USER_DATABASE.get_sheet_data("users")
    # 关闭数据库连接
    await USER_DATABASE.conn.close()

if __name__ == "__main__":
    asyncio.run(main())