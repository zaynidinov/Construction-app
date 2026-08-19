import os
import json
import asyncio
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID", "0"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(F.web_app_data)
async def handle_web_app_data(message: types.Message):
    data = json.loads(message.web_app_data.data)
    user_id = message.from_user.id
    
    text = "📥 **YANGI BUYURTMA!**\n\n"
    grand_total = 0
    for service, info in data['items'].items():
        text += f"• {service}: {info['sqm']} kv.m ({info['total']:,} so'm)\n"
        grand_total += info['total']
        
    text += f"\n💰 **Jami:** {grand_total:,} so'm\n"
    text += f"👤 **Mijoz:** {data['name']}\n"
    text += f"📞 **Tel:** {data['phone']}\n"
    text += f"📍 **Manzil:** {data['address']}\n"
    text += f"💳 **To'lov:** {data['payment']}"

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Tasdiqlash", callback_data=f"accept_{user_id}"),
            InlineKeyboardButton(text="❌ Rad etish", callback_data=f"reject_{user_id}")
        ]
    ])

    await bot.send_message(chat_id=ADMIN_ID, text=text, reply_markup=keyboard, parse_mode="Markdown")
    await message.answer("✅ Buyurtmangiz qabul qilindi. Operator tasdiqlashini kuting!")

@dp.callback_query(F.data.startswith("accept_") | F.data.startswith("reject_"))
async def process_order_status(callback: types.CallbackQuery):
    action, client_id = callback.data.split("_")
    client_id = int(client_id)

    if action == "accept":
        await bot.send_message(chat_id=client_id, text="🎉 **Xushxabar!** Buyurtmangiz tasdiqlandi. Usta tez orada siz bilan bog'lanadi.")
        await callback.message.edit_text(callback.message.text + "\n\n✅ **HOLAT: TASDIQLANDI**")
    else:
        await bot.send_message(chat_id=client_id, text="❌ Afsuski, buyurtmangiz rad etildi.")
        await callback.message.edit_text(callback.message.text + "\n\n❌ **HOLAT: RAD ETILDI**")
    
    await callback.answer()

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
