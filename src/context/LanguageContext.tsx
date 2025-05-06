
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/utils/storage';

type LanguageContextType = {
  language: 'ar' | 'en';
  setLanguage: (language: 'ar' | 'en') => void;
  t: (key: string) => string;
};

const translations = {
  ar: {
    // General
    "all_products": "كل المنتجات",
    "no_products_in_category": "لا توجد منتجات في هذا التصنيف",
    "no_categories_available": "لا توجد تصنيفات متاحة",
    "settings": "الإعدادات",
    "save_settings": "حفظ الإعدادات",
    "general": "عام",
    "printing": "الطباعة",
    "business": "معلومات المتجر",
    "search_products": "البحث عن منتجات...",
    
    // Settings
    "general_settings": "إعدادات عامة",
    "auto_print_receipt": "طباعة تلقائية للفواتير",
    "auto_print_receipt_desc": "طباعة الفاتورة تلقائياً عند إتمام الطلب",
    "auto_kitchen_print": "طباعة تلقائية للمطبخ",
    "auto_kitchen_print_desc": "إرسال الطلب تلقائياً للطباعة في المطبخ",
    "show_price_kitchen": "عرض الأسعار في شاشة المطبخ",
    "show_price_kitchen_desc": "عرض أسعار المنتجات في شاشة المطبخ",
    "app_language": "لغة البرنامج",
    "app_language_desc": "اختر لغة واجهة المستخدم",
    "currency_symbol": "رمز العملة",
    "arabic": "العربية",
    "english": "English",
    "choose_language": "اختر اللغة",
    
    // Printing settings
    "printing_settings": "إعدادات الطباعة",
    "receipt_printer": "طابعة الفواتير",
    "kitchen_printer": "طابعة المطبخ",
    "choose_printer": "اختر طابعة",
    "default_printer": "الطابعة الافتراضية",
    "thermal_printer": "طابعة حرارية",
    "receipt_width": "عرض الفاتورة (مم)",
    "show_logo": "عرض الشعار في الفاتورة",
    
    // Business settings
    "business_info": "معلومات المتجر",
    "business_name": "اسم المتجر",
    "business_address": "عنوان المتجر",
    "business_phone": "رقم الهاتف",
    "tax_rate": "نسبة الضريبة (%)",
    "receipt_footer": "نص أسفل الفاتورة",
    
    // Error messages
    "no_permission": "لا تملك صلاحية تعديل الإعدادات",
    "settings_saved": "تم حفظ الإعدادات بنجاح",
    "settings_error": "حدث خطأ أثناء حفظ الإعدادات",
    "unauthorized": "غير مصرح",
    "no_access": "ليس لديك صلاحية الوصول إلى إعدادات النظام",
  },
  en: {
    // General
    "all_products": "All Products",
    "no_products_in_category": "No products in this category",
    "no_categories_available": "No categories available",
    "settings": "Settings",
    "save_settings": "Save Settings",
    "general": "General",
    "printing": "Printing",
    "business": "Business",
    "search_products": "Search products...",
    
    // Settings
    "general_settings": "General Settings",
    "auto_print_receipt": "Auto Print Receipt",
    "auto_print_receipt_desc": "Automatically print receipt when order is completed",
    "auto_kitchen_print": "Auto Kitchen Print",
    "auto_kitchen_print_desc": "Automatically send order to kitchen printer",
    "show_price_kitchen": "Show Prices on Kitchen Display",
    "show_price_kitchen_desc": "Display product prices on kitchen screen",
    "app_language": "Application Language",
    "app_language_desc": "Choose the user interface language",
    "currency_symbol": "Currency Symbol",
    "arabic": "العربية",
    "english": "English",
    "choose_language": "Choose Language",
    
    // Printing settings
    "printing_settings": "Printing Settings",
    "receipt_printer": "Receipt Printer",
    "kitchen_printer": "Kitchen Printer",
    "choose_printer": "Choose a printer",
    "default_printer": "Default Printer",
    "thermal_printer": "Thermal Printer",
    "receipt_width": "Receipt Width (mm)",
    "show_logo": "Show Logo on Receipt",
    
    // Business settings
    "business_info": "Business Information",
    "business_name": "Business Name",
    "business_address": "Business Address",
    "business_phone": "Phone Number",
    "tax_rate": "Tax Rate (%)",
    "receipt_footer": "Receipt Footer Text",
    
    // Error messages
    "no_permission": "You don't have permission to edit settings",
    "settings_saved": "Settings saved successfully",
    "settings_error": "Error saving settings",
    "unauthorized": "Unauthorized",
    "no_access": "You don't have access to system settings",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return getSettings().language || 'ar';
  });
  
  const setLanguage = (newLanguage: 'ar' | 'en') => {
    setLanguageState(newLanguage);
    const settings = getSettings();
    updateSettings({ ...settings, language: newLanguage });
    
    // Set the page direction based on language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };
  
  // Function to get translated text
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };
  
  // Initialize direction on page load
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
