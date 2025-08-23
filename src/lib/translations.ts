export type Language = 'fr' | 'en' | 'pt' | 'es' | 'ar';

export interface Translations {
  consent: {
    title: string;
    subtitle: string;
    policyTitle: string;
    dataCollection: string;
    dataUsage: string;
    dataStorage: string;
    detailsTitle: string;
    collectionDetails: string;
    usageDetails: string;
    securityDetails: string;
    rightsDetails: string;
    transferDetails: string;
    withdrawalDetails: string;
    lastUpdated: string;
    acceptLabel: string;
    acceptHint: string;
    continueButton: string;
  };
  registration: {
    title: string;
    subtitle: string;
    alreadyRegistered: string;
    alreadyRegisteredDesc: string;
    accessProgram: string;
    inactiveEvent: string;
    inactiveEventDesc: string;
    inactive: string;
    registered: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    position: string;
    positionPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    consentLabel: string;
    consentHint: string;
    registerButton: string;
    registering: string;
  };
  language: {
    select: string;
    french: string;
    english: string;
    portuguese: string;
    spanish: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    consent: {
      title: 'DÉTAILS DE CONSENTEMENT',
      subtitle: 'Avant de vous inscrire, veuillez prendre connaissance de notre politique de confidentialité',
      policyTitle: 'Politique de confidentialité',
      dataCollection: 'La collecte de vos informations personnelles (nom, organisation, coordonnées, données de participation) via la plateforme QR Code ;',
      dataUsage: 'L\'utilisation de ces données pour la gestion de votre inscription et de votre participation à l\'événement, la facilitation des interactions et la production de rapports anonymisés ;',
      dataStorage: 'La conservation sécurisée de vos données conformément à la politique de protection de l\'ANSUT',
      detailsTitle: 'Détails Complémentaires',
      collectionDetails: 'Vos données sont collectées électroniquement à travers la plateforme d\'inscription par QR code.',
      usageDetails: 'Les données collectées servent exclusivement à : Gérer votre inscription et votre participation à l\'atelier, Faciliter vos interactions avec les autres participants, Produire des rapports anonymisés à des fins d\'évaluation',
      securityDetails: 'L\'ANSUT s\'engage à conserver vos données dans des conditions de sécurité optimales et à limiter l\'accès aux seules personnes habilitées.',
      rightsDetails: 'Vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données. Pour exercer ces droits, vous pouvez contacter l\'ANSUT.',
      transferDetails: 'Aucun transfert de vos données vers un pays tiers n\'est effectué sans garanties appropriées. Tout transfert nécessite votre consentement explicite.',
      withdrawalDetails: 'Vous pouvez retirer votre consentement à tout moment en contactant l\'ANSUT ou l\'Autorité de Régulation des Télécommunications/TIC de Côte d\'Ivoire (ARTCI).',
      lastUpdated: 'Dernière mise à jour :',
      acceptLabel: 'J\'ai lu et j\'accepte la politique de confidentialité *',
      acceptHint: 'Vous devez accepter pour continuer votre inscription',
      continueButton: 'Continuer vers l\'inscription'
    },
    registration: {
      title: 'Inscription',
      subtitle: 'Inscrivez-vous pour participer à l\'événement',
      alreadyRegistered: 'Déjà inscrit',
      alreadyRegisteredDesc: 'Vous êtes déjà inscrit à cet événement',
      accessProgram: 'Accéder au programme de l\'événement',
      inactiveEvent: 'Événement inactif',
      inactiveEventDesc: 'Cet événement n\'est pas encore actif pour les inscriptions',
      inactive: 'Inactif',
      registered: 'Inscrit',
      firstName: 'Prénom *',
      firstNamePlaceholder: 'Jean',
      lastName: 'Nom *',
      lastNamePlaceholder: 'Dupont',
      email: 'Email *',
      emailPlaceholder: 'votre@email.com',
      position: 'Fonction *',
      positionPlaceholder: 'Directeur',
      company: 'Structure *',
      companyPlaceholder: 'Entreprise',
      consentLabel: 'J\'accepte de recevoir des communications concernant cet événement *',
      consentHint: 'Vous pouvez vous désinscrire à tout moment',
      registerButton: 'S\'inscrire à l\'événement',
      registering: 'Inscription...'
    },
    language: {
      select: 'Choisissez votre langue',
      french: 'Français',
      english: 'Anglais',
      portuguese: 'Portugais',
      spanish: 'Espagnol'
    }
  },
  en: {
    consent: {
      title: 'CONSENT DETAILS',
      subtitle: 'Before registering, please review our privacy policy',
      policyTitle: 'Privacy Policy',
      dataCollection: 'Collection of your personal information (name, organization, contact details, participation data) through the QR Code platform;',
      dataUsage: 'Use of this data for managing your registration and participation in the event, facilitating interactions, and producing anonymized reports;',
      dataStorage: 'Secure storage of your data in accordance with ANSUT\'s protection policy',
      detailsTitle: 'Additional Details',
      collectionDetails: 'Your data is collected electronically through the QR code registration platform.',
      usageDetails: 'The collected data is used exclusively to: Manage your registration and participation in the workshop, Facilitate your interactions with other participants, Produce anonymized reports for evaluation purposes',
      securityDetails: 'ANSUT is committed to storing your data under optimal security conditions and limiting access to authorized personnel only.',
      rightsDetails: 'You have the right to access, rectify, and delete your data. To exercise these rights, you can contact ANSUT.',
      transferDetails: 'No transfer of your data to third countries is carried out without appropriate guarantees. Any transfer requires your explicit consent.',
      withdrawalDetails: 'You can withdraw your consent at any time by contacting ANSUT or the Telecommunications/ICT Regulatory Authority of Côte d\'Ivoire (ARTCI).',
      lastUpdated: 'Last updated:',
      acceptLabel: 'I have read and accept the privacy policy *',
      acceptHint: 'You must accept to continue your registration',
      continueButton: 'Continue to registration'
    },
    registration: {
      title: 'Registration',
      subtitle: 'Register to participate in the event',
      alreadyRegistered: 'Already registered',
      alreadyRegisteredDesc: 'You are already registered for this event',
      accessProgram: 'Access event program',
      inactiveEvent: 'Inactive event',
      inactiveEventDesc: 'This event is not yet active for registrations',
      inactive: 'Inactive',
      registered: 'Registered',
      firstName: 'First name *',
      firstNamePlaceholder: 'John',
      lastName: 'Last name *',
      lastNamePlaceholder: 'Doe',
      email: 'Email *',
      emailPlaceholder: 'your@email.com',
      position: 'Position *',
      positionPlaceholder: 'Director',
      company: 'Organization *',
      companyPlaceholder: 'Company',
      consentLabel: 'I agree to receive communications about this event *',
      consentHint: 'You can unsubscribe at any time',
      registerButton: 'Register for the event',
      registering: 'Registering...'
    },
    language: {
      select: 'Choose your language',
      french: 'French',
      english: 'English',
      portuguese: 'Portuguese',
      spanish: 'Spanish'
    }
  },
  pt: {
    consent: {
      title: 'DETALHES DO CONSENTIMENTO',
      subtitle: 'Antes de se registrar, por favor revise nossa política de privacidade',
      policyTitle: 'Política de Privacidade',
      dataCollection: 'Coleta de suas informações pessoais (nome, organização, dados de contato, dados de participação) através da plataforma de Código QR;',
      dataUsage: 'Uso desses dados para gerenciar seu registro e participação no evento, facilitar interações e produzir relatórios anonimizados;',
      dataStorage: 'Armazenamento seguro de seus dados de acordo com a política de proteção da ANSUT',
      detailsTitle: 'Detalhes Adicionais',
      collectionDetails: 'Seus dados são coletados eletronicamente através da plataforma de registro por código QR.',
      usageDetails: 'Os dados coletados são usados exclusivamente para: Gerenciar seu registro e participação no workshop, Facilitar suas interações com outros participantes, Produzir relatórios anonimizados para fins de avaliação',
      securityDetails: 'A ANSUT se compromete a armazenar seus dados em condições de segurança ideais e limitar o acesso apenas a pessoal autorizado.',
      rightsDetails: 'Você tem o direito de acessar, retificar e excluir seus dados. Para exercer esses direitos, você pode entrar em contato com a ANSUT.',
      transferDetails: 'Nenhuma transferência de seus dados para países terceiros é realizada sem garantias apropriadas. Qualquer transferência requer seu consentimento explícito.',
      withdrawalDetails: 'Você pode retirar seu consentimento a qualquer momento entrando em contato com a ANSUT ou a Autoridade Reguladora de Telecomunicações/TIC da Costa do Marfim (ARTCI).',
      lastUpdated: 'Última atualização:',
      acceptLabel: 'Li e aceito a política de privacidade *',
      acceptHint: 'Você deve aceitar para continuar seu registro',
      continueButton: 'Continuar para o registro'
    },
    registration: {
      title: 'Registro',
      subtitle: 'Registre-se para participar do evento',
      alreadyRegistered: 'Já registrado',
      alreadyRegisteredDesc: 'Você já está registrado para este evento',
      accessProgram: 'Acessar programa do evento',
      inactiveEvent: 'Evento inativo',
      inactiveEventDesc: 'Este evento ainda não está ativo para registros',
      inactive: 'Inativo',
      registered: 'Registrado',
      firstName: 'Nome *',
      firstNamePlaceholder: 'João',
      lastName: 'Sobrenome *',
      lastNamePlaceholder: 'Silva',
      email: 'Email *',
      emailPlaceholder: 'seu@email.com',
      position: 'Cargo *',
      positionPlaceholder: 'Diretor',
      company: 'Organização *',
      companyPlaceholder: 'Empresa',
      consentLabel: 'Concordo em receber comunicações sobre este evento *',
      consentHint: 'Você pode cancelar a inscrição a qualquer momento',
      registerButton: 'Registrar para o evento',
      registering: 'Registrando...'
    },
    language: {
      select: 'Escolha seu idioma',
      french: 'Francês',
      english: 'Inglês',
      portuguese: 'Português',
      spanish: 'Espanhol'
    }
  },
  es: {
    consent: {
      title: 'DETALLES DEL CONSENTIMIENTO',
      subtitle: 'Antes de registrarse, por favor revise nuestra política de privacidad',
      policyTitle: 'Política de Privacidad',
      dataCollection: 'Recopilación de su información personal (nombre, organización, datos de contacto, datos de participación) a través de la plataforma de Código QR;',
      dataUsage: 'Uso de estos datos para gestionar su registro y participación en el evento, facilitar interacciones y producir informes anónimos;',
      dataStorage: 'Almacenamiento seguro de sus datos de acuerdo con la política de protección de ANSUT',
      detailsTitle: 'Detalles Adicionales',
      collectionDetails: 'Sus datos se recopilan electrónicamente a través de la plataforma de registro por código QR.',
      usageDetails: 'Los datos recopilados se utilizan exclusivamente para: Gestionar su registro y participación en el taller, Facilitar sus interacciones con otros participantes, Producir informes anónimos con fines de evaluación',
      securityDetails: 'ANSUT se compromete a almacenar sus datos en condiciones de seguridad óptimas y limitar el acceso solo al personal autorizado.',
      rightsDetails: 'Tiene derecho a acceder, rectificar y eliminar sus datos. Para ejercer estos derechos, puede contactar a ANSUT.',
      transferDetails: 'No se realiza ninguna transferencia de sus datos a países terceros sin garantías apropiadas. Cualquier transferencia requiere su consentimiento explícito.',
      withdrawalDetails: 'Puede retirar su consentimiento en cualquier momento contactando a ANSUT o a la Autoridad Reguladora de Telecomunicaciones/TIC de Costa de Marfil (ARTCI).',
      lastUpdated: 'Última actualización:',
      acceptLabel: 'He leído y acepto la política de privacidad *',
      acceptHint: 'Debe aceptar para continuar con su registro',
      continueButton: 'Continuar al registro'
    },
    registration: {
      title: 'Registro',
      subtitle: 'Regístrese para participar en el evento',
      alreadyRegistered: 'Ya registrado',
      alreadyRegisteredDesc: 'Ya está registrado para este evento',
      accessProgram: 'Acceder al programa del evento',
      inactiveEvent: 'Evento inactivo',
      inactiveEventDesc: 'Este evento aún no está activo para registros',
      inactive: 'Inactivo',
      registered: 'Registrado',
      firstName: 'Nombre *',
      firstNamePlaceholder: 'Juan',
      lastName: 'Apellido *',
      lastNamePlaceholder: 'García',
      email: 'Email *',
      emailPlaceholder: 'su@email.com',
      position: 'Cargo *',
      positionPlaceholder: 'Director',
      company: 'Organización *',
      companyPlaceholder: 'Empresa',
      consentLabel: 'Acepto recibir comunicaciones sobre este evento *',
      consentHint: 'Puede darse de baja en cualquier momento',
      registerButton: 'Registrarse para el evento',
      registering: 'Registrando...'
    },
    language: {
      select: 'Elija su idioma',
      french: 'Francés',
      english: 'Inglés',
      portuguese: 'Portugués',
      spanish: 'Español'
    }
  },
  ar: {
    consent: {
      title: 'تفاصيل الموافقة',
      subtitle: 'قبل التسجيل، يرجى مراجعة سياسة الخصوصية الخاصة بنا',
      policyTitle: 'سياسة الخصوصية',
      dataCollection: 'جمع معلوماتك الشخصية (الاسم، المؤسسة، بيانات الاتصال، بيانات المشاركة) من خلال منصة رمز الاستجابة السريعة؛',
      dataUsage: 'استخدام هذه البيانات لإدارة تسجيلك ومشاركتك في الحدث، وتسهيل التفاعلات، وإنتاج تقارير مجهولة المصدر؛',
      dataStorage: 'تخزين بياناتك بشكل آمن وفقًا لسياسة حماية ANSUT',
      detailsTitle: 'تفاصيل إضافية',
      collectionDetails: 'يتم جمع بياناتك إلكترونيًا من خلال منصة التسجيل برمز الاستجابة السريعة.',
      usageDetails: 'يتم استخدام البيانات المجمعة حصريًا لـ: إدارة تسجيلك ومشاركتك في الورشة، تسهيل تفاعلاتك مع المشاركين الآخرين، إنتاج تقارير مجهولة المصدر لأغراض التقييم',
      securityDetails: 'تلتزم ANSUT بتخزين بياناتك في ظروف أمنية مثالية والحد من الوصول إلى الأشخاص المصرح لهم فقط.',
      rightsDetails: 'لديك الحق في الوصول إلى بياناتك وتصحيحها وحذفها. لممارسة هذه الحقوق، يمكنك الاتصال بـ ANSUT.',
      transferDetails: 'لا يتم نقل بياناتك إلى دول ثالثة دون ضمانات مناسبة. أي نقل يتطلب موافقتك الصريحة.',
      withdrawalDetails: 'يمكنك سحب موافقتك في أي وقت عن طريق الاتصال بـ ANSUT أو الهيئة التنظيمية للاتصالات/تكنولوجيا المعلومات والمعلومات في ساحل العاج (ARTCI).',
      lastUpdated: 'آخر تحديث:',
      acceptLabel: 'لقد قرأت وأوافق على سياسة الخصوصية *',
      acceptHint: 'يجب أن توافق للمتابعة في التسجيل',
      continueButton: 'المتابعة إلى التسجيل'
    },
    registration: {
      title: 'التسجيل',
      subtitle: 'سجل للاشتراك في الحدث',
      alreadyRegistered: 'مسجل بالفعل',
      alreadyRegisteredDesc: 'أنت مسجل بالفعل في هذا الحدث',
      accessProgram: 'الوصول إلى برنامج الحدث',
      inactiveEvent: 'حدث غير نشط',
      inactiveEventDesc: 'هذا الحدث غير نشط بعد للتسجيلات',
      inactive: 'غير نشط',
      registered: 'مسجل',
      firstName: 'الاسم الأول *',
      firstNamePlaceholder: 'محمد',
      lastName: 'اسم العائلة *',
      lastNamePlaceholder: 'أحمد',
      email: 'البريد الإلكتروني *',
      emailPlaceholder: 'بريدك@الإلكتروني.com',
      position: 'المنصب *',
      positionPlaceholder: 'مدير',
      company: 'المؤسسة *',
      companyPlaceholder: 'شركة',
      consentLabel: 'أوافق على تلقي اتصالات حول هذا الحدث *',
      consentHint: 'يمكنك إلغاء الاشتراك في أي وقت',
      registerButton: 'التسجيل في الحدث',
      registering: 'جاري التسجيل...'
    },
    language: {
      select: 'اختر لغتك',
      french: 'الفرنسية',
      english: 'الإنجليزية',
      portuguese: 'البرتغالية',
      spanish: 'الإسبانية'
    }
  }
};

export const getLanguageName = (code: Language): string => {
  const names = {
    fr: 'Français',
    en: 'English',
    pt: 'Português',
    es: 'Español',
    ar: 'العربية'
  };
  return names[code];
};