export type Language = 'fr' | 'en' | 'pt' | 'es' | 'ar';

export function getLanguageName(language: Language): string {
  switch (language) {
    case 'fr':
      return 'Français'
    case 'en':
      return 'English'
    case 'pt':
      return 'Português'
    case 'es':
      return 'Español'
    case 'ar':
      return 'العربية'
    default:
      return language
  }
}

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
  program: {
    title: string;
    welcome: string;
    currentTime: string;
    eventTitle: string;
    activity: string;
    speaker: string;
    location: string;
    conference: string;
    workshop: string;
    networking: string;
    break: string;
    ceremony: string;
    other: string;
    logout: string;
    copyright: string;
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
      usageDetails: 'Les données collectées servent exclusivement à : Gérer votre inscription et votre participation à l\'atelier, Faciliter vos interactions avec les autres participantes, Produire des rapports anonymisés à des fins d\'évaluation',
      securityDetails: 'L\'ANSUT s\'engage à conserver vos données dans des conditions de sécurité optimales et à limiter l\'accès aux seules personnes habilitées.',
      rightsDetails: 'Vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données. Pour exercer ces droits, vous pouvez contacter l\'ANSUT.',
      transferDetails: 'Aucun transfert de vos données vers un pays tiers n\'est effectué sans garanties appropriées. Tout transfert nécessite votre consentement explicite.',
      withdrawalDetails: 'Vous pouvez retirer votre consentement à tout moment en contactant l\'ANSUT ou l\'Autorité de Régulation des Télécommunications/TIC de Côte d\'Ivoire (ARTCI).',
      lastUpdated: 'Dernière mise à jour :',
      acceptLabel: 'J\'ai lu et j\'accepte la politique de confidentialité *',
      acceptHint: 'Vous devez accepter la politique de confidentialité pour continuer',
      continueButton: 'Continuer vers l\'inscription'
    },
    registration: {
      title: 'Inscription',
      subtitle: 'Remplissez le formulaire ci-dessous pour vous inscrire à l\'événement',
      alreadyRegistered: 'Déjà inscrit ?',
      alreadyRegisteredDesc: 'Vous avez déjà rempli le formulaire d\'inscription pour cet événement',
      accessProgram: 'Accéder au programme',
      inactiveEvent: 'Événement inactive',
      inactiveEventDesc: 'Cet événement n\'est pas actif pour le moment',
      inactive: 'Inactive',
      registered: 'Inscrit',
      firstName: 'Prénom *',
      firstNamePlaceholder: 'Votre prénom',
      lastName: 'Nom *',
      lastNamePlaceholder: 'Votre nom',
      email: 'Email *',
      emailPlaceholder: 'votre@email.com',
      position: 'Poste',
      positionPlaceholder: 'Votre poste',
      company: 'Organisation',
      companyPlaceholder: 'Votre organisation',
      consentLabel: 'J\'accepte de recevoir des communications liées à cet événement',
      consentHint: 'Vous pouvez vous désinscrire à tout moment',
      registerButton: 'S\'inscrire',
      registering: 'Inscription en cours...'
    },
    language: {
      select: 'Sélectionnez votre langue',
      french: 'Français',
      english: 'Anglais',
      portuguese: 'Portugais',
      spanish: 'Espagnol'
    },
    program: {
      title: 'Programme',
      welcome: 'Bienvenue au programme de l\'événement',
      currentTime: 'Heure actuelle',
      eventTitle: 'Titre de l\'événement',
      activity: 'Activité',
      speaker: 'Intervenant',
      location: 'Lieu',
      conference: 'Conférence',
      workshop: 'Atelier',
      networking: 'Networking',
      break: 'Pause',
      ceremony: 'Cérémonie',
      other: 'Autre',
      logout: 'Se déconnecter',
      copyright: '© 2025 ANSUT. Tous droits réservés.'
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
      usageDetails: 'Collected data is used exclusively for: Managing your registration and participation in the workshop, Facilitating your interactions with other participants, Producing anonymized reports for evaluation purposes',
      securityDetails: 'ANSUT is committed to storing your data under optimal security conditions and limiting access to authorized personnel only.',
      rightsDetails: 'You have the right to access, rectify, and delete your data. To exercise these rights, you can contact ANSUT.',
      transferDetails: 'No transfer of your data to third countries is carried out without appropriate guarantees. Any transfer requires your explicit consent.',
      withdrawalDetails: 'You can withdraw your consent at any time by contacting ANSUT or the Telecommunications/ICT Regulatory Authority of Côte d\'Ivoire (ARTCI).',
      lastUpdated: 'Last updated:',
      acceptLabel: 'I have read and accept the privacy policy *',
      acceptHint: 'You must accept the privacy policy to continue',
      continueButton: 'Continue to registration'
    },
    registration: {
      title: 'Registration',
      subtitle: 'Fill out the form below to register for the event',
      alreadyRegistered: 'Already registered?',
      alreadyRegisteredDesc: 'You have already completed the registration form for this event',
      accessProgram: 'Access program',
      inactiveEvent: 'Inactive event',
      inactiveEventDesc: 'This event is not active at the moment',
      inactive: 'Inactive',
      registered: 'Registered',
      firstName: 'First Name *',
      firstNamePlaceholder: 'Your first name',
      lastName: 'Last Name *',
      lastNamePlaceholder: 'Your last name',
      email: 'Email *',
      emailPlaceholder: 'your@email.com',
      position: 'Position',
      positionPlaceholder: 'Your position',
      company: 'Organization',
      companyPlaceholder: 'Your organization',
      consentLabel: 'I agree to receive communications related to this event',
      consentHint: 'You can unsubscribe at any time',
      registerButton: 'Register',
      registering: 'Registering...'
    },
    language: {
      select: 'Select your language',
      french: 'French',
      english: 'English',
      portuguese: 'Portuguese',
      spanish: 'Spanish'
    },
    program: {
      title: 'Program',
      welcome: 'Welcome to the event program',
      currentTime: 'Current time',
      eventTitle: 'Event title',
      activity: 'Activity',
      speaker: 'Speaker',
      location: 'Location',
      conference: 'Conference',
      workshop: 'Workshop',
      networking: 'Networking',
      break: 'Break',
      ceremony: 'Ceremony',
      other: 'Other',
      logout: 'Logout',
      copyright: '© 2025 ANSUT. All rights reserved.'
    }
  },
  pt: {
    consent: {
      title: 'DETALHES DE CONSENTIMENTO',
      subtitle: 'Antes de se registrar, por favor revise nossa política de privacidade',
      policyTitle: 'Política de Privacidade',
      dataCollection: 'Coleta de suas informações pessoais (nome, organização, dados de contato, dados de participação) através da plataforma QR Code;',
      dataUsage: 'Uso desses dados para gerenciar sua inscrição e participação no evento, facilitar interações e produzir relatórios anonimizados;',
      dataStorage: 'Armazenamento seguro de seus dados de acordo com a política de proteção da ANSUT',
      detailsTitle: 'Detalhes Adicionais',
      collectionDetails: 'Seus dados são coletados eletronicamente através da plataforma de registro por QR code.',
      usageDetails: 'Os dados coletados são usados exclusivamente para: Gerenciar sua inscrição e participação no workshop, Facilitar suas interações com outros participantes, Produzir relatórios anonimizados para fins de avaliação',
      securityDetails: 'A ANSUT se compromete a armazenar seus dados em condições de segurança ideais e limitar o acesso apenas ao pessoal autorizado.',
      rightsDetails: 'Você tem o direito de acessor, retificar e excluir seus dados. Para exercer esses direitos, você pode entrar em contato com a ANSUT.',
      transferDetails: 'Nenhuma transferência de seus dados para países terceiros é realizada sem garantias apropriadas. Qualquer transferência requer seu consentimento explícito.',
      withdrawalDetails: 'Você pode retirar seu consentimento a qualquer momento entrando em contato com a ANSUT ou a Autoridade Reguladora de Telecomunicações/TIC da Costa do Marfim (ARTCI).',
      lastUpdated: 'Última atualização:',
      acceptLabel: 'Li e aceito a política de privacidade *',
      acceptHint: 'Você deve aceitar a política de privacidade para continuar',
      continueButton: 'Continuar para inscrição'
    },
    registration: {
      title: 'Inscrição',
      subtitle: 'Preencha o formulário abaixo para se inscrever no evento',
      alreadyRegistered: 'Já está inscrito?',
      alreadyRegisteredDesc: 'Você já preencheu o formulário de inscrição para este evento',
      accessProgram: 'Acessar programa',
      inactiveEvent: 'Evento inativo',
      inactiveEventDesc: 'Este evento não está ativo no momento',
      inactive: 'Inativo',
      registered: 'Inscrito',
      firstName: 'Nome *',
      firstNamePlaceholder: 'Seu nome',
      lastName: 'Sobrenome *',
      lastNamePlaceholder: 'Seu sobrenome',
      email: 'Email *',
      emailPlaceholder: 'seu@email.com',
      position: 'Cargo',
      positionPlaceholder: 'Seu cargo',
      company: 'Organização',
      companyPlaceholder: 'Sua organização',
      consentLabel: 'Concordo em receber comunicações relacionadas a este evento',
      consentHint: 'Você pode cancelar a inscrição a qualquer momento',
      registerButton: 'Inscrever-se',
      registering: 'Inscrevendo...'
    },
    language: {
      select: 'Selecione seu idioma',
      french: 'Francês',
      english: 'Inglês',
      portuguese: 'Português',
      spanish: 'Espanhol'
    },
    program: {
      title: 'Programa',
      welcome: 'Bem-vindo ao programa do evento',
      currentTime: 'Hora atual',
      eventTitle: 'Título do evento',
      activity: 'Atividade',
      speaker: 'Palestrante',
      location: 'Local',
      conference: 'Conferência',
      workshop: 'Workshop',
      networking: 'Networking',
      break: 'Intervalo',
      ceremony: 'Cerimônia',
      other: 'Outro',
      logout: 'Sair',
      copyright: '© 2025 ANSUT. Todos os direitos reservados.'
    }
  },
  es: {
    consent: {
      title: 'DETALLES DE CONSENTIMIENTO',
      subtitle: 'Antes de registrarse, por favor revise nuestra política de privacidad',
      policyTitle: 'Política de Privacidad',
      dataCollection: 'Recopilación de su información personal (nombre, organización, datos de contacto, datos de participación) a través de la plataforma QR Code;',
      dataUsage: 'Uso de estos datos para gestionar su registro y participación en el evento, facilitar interacciones y producir informes anonimizados;',
      dataStorage: 'Almacenamiento seguro de sus datos de acuerdo con la política de protección de ANSUT',
      detailsTitle: 'Detalles Adicionales',
      collectionDetails: 'Sus datos se recopilan electrónicamente a través de la plataforma de registro por código QR.',
      usageDetails: 'Los datos recopilados se utilizan exclusivamente para: Gestionar su registro y participación en el taller, Facilitar sus interacciones con otros participantes, Producir informes anonimizados con fines de evaluación',
      securityDetails: 'ANSUT se compromete a almacenar sus datos en condiciones de seguridad óptimas y limitar el acceso únicamente al personal autorizado.',
      rightsDetails: 'Tiene derecho a acceder, rectificar y eliminar sus datos. Para ejercer estos derechos, puede contactar a ANSUT.',
      transferDetails: 'No se realiza ninguna transferencia de sus datos a países terceros sin garantías apropriadas. Cualquier transferencia requiere su consentimiento explícito.',
      withdrawalDetails: 'Puede retirar su consentimiento en cualquier momento contactando a ANSUT o a la Autoridad Reguladora de Telecomunicaciones/TIC de Costa de Marfil (ARTCI).',
      lastUpdated: 'Última actualización:',
      acceptLabel: 'He leído y acepto la política de privacidad *',
      acceptHint: 'Debe aceptar la política de privacidad para continuar',
      continueButton: 'Continuar al registro'
    },
    registration: {
      title: 'Registro',
      subtitle: 'Complete el formulario a continuación para registrarse en el evento',
      alreadyRegistered: '¿Ya está registrado?',
      alreadyRegisteredDesc: 'Ya ha completado el formulario de registro para este evento',
      accessProgram: 'Acceder al programa',
      inactiveEvent: 'Evento inactivo',
      inactiveEventDesc: 'Este evento no está activo en este momento',
      inactive: 'Inactivo',
      registered: 'Registrado',
      firstName: 'Nombre *',
      firstNamePlaceholder: 'Su nombre',
      lastName: 'Apellido *',
      lastNamePlaceholder: 'Su apellido',
      email: 'Email *',
      emailPlaceholder: 'su@email.com',
      position: 'Cargo',
      positionPlaceholder: 'Su cargo',
      company: 'Organización',
      companyPlaceholder: 'Su organización',
      consentLabel: 'Acepto recibir comunicaciones relacionadas con este evento',
      consentHint: 'Puede darse de baja en cualquier momento',
      registerButton: 'Registrarse',
      registering: 'Registrando...'
    },
    language: {
      select: 'Seleccione su idioma',
      french: 'Francés',
      english: 'Inglés',
      portuguese: 'Portugués',
      spanish: 'Español'
    },
    program: {
      title: 'Programa',
      welcome: 'Bienvenido al programa del evento',
      currentTime: 'Hora actual',
      eventTitle: 'Título del evento',
      activity: 'Actividad',
      speaker: 'Ponente',
      location: 'Ubicación',
      conference: 'Conferencia',
      workshop: 'Taller',
      networking: 'Networking',
      break: 'Descanso',
      ceremony: 'Ceremonia',
      other: 'Otro',
      logout: 'Cerrar sesión',
      copyright: '© 2025 ANSUT. Todos los derechos reservados.'
    }
  },
  ar: {
    consent: {
      title: 'تفاصيل الموافقة',
      subtitle: 'قبل التسجيل، يرجى مراجعة سياسة الخصوصية الخاصة بنا',
      policyTitle: 'سياسة الخصوصية',
      dataCollection: 'جمع معلوماتك الشخصية (الاسم، المنظمة، بيانات الاتصال، بيانات المشاركة) من خلال منصة رمز الاستجابة السريعة؛',
      dataUsage: 'استخدام هذه البيانات لإدارة تسجيلك ومشاركتك في الحدث، وتسهيل التفاعلات وإنتاج تقارير مجهولة المصدر؛',
      dataStorage: 'التخزين الآمن لبياناتك وفقًا لسياسة حماية ANSUT',
      detailsTitle: 'تفاصيل إضافية',
      collectionDetails: 'يتم جمع بياناتك إلكترونيًا من خلال منصة التسجيل برمز الاستجابة السريعة.',
      usageDetails: 'يتم استخدام البيانات التي تم جمعها حصريًا لـ: إدارة تسجيلك ومشاركتك في الورشة، تسهيل تفاعلاتك مع المشاركين الآخرين، إنتاج تقارير مجهولة المصدر لأغراض التقييم',
      securityDetails: 'تلتزم ANSUT بتخزين بياناتك في ظل ظروف أمنية مثالية والحد من الوصول إلى الموظفين المعتمدين فقط.',
      rightsDetails: 'لديك الحق في الوصول إلى بياناتك وتصحيحها وحذفها. لممارسة هذه الحقوق، يمكنك الاتصال بـ ANSUT.',
      transferDetails: 'لا يتم نقل بياناتك إلى دول ثالثة دون ضمانات مناسبة. أي نقل يتطلب موافقتك الصريحة.',
      withdrawalDetails: 'يمكنك سحب موافقتك في أي وقت عن طريق الاتصال بـ ANSUT أو الهيئة التنظيمية للاتصالات/تكنولوجيا المعلومات والمعلومات في ساحل العاج (ARTCI).',
      lastUpdated: 'آخر تحديث:',
      acceptLabel: 'لقد قرأت وأوافق على سياسة الخصوصية *',
      acceptHint: 'يجب عليك قبول سياسة الخصوصية للمتابعة',
      continueButton: 'المتابعة إلى التسجيل'
    },
    registration: {
      title: 'التسجيل',
      subtitle: 'املأ النموذج أدناه للتسجيل في الحدث',
      alreadyRegistered: 'مسجل بالفعل؟',
      alreadyRegisteredDesc: 'لقد أكملت بالفعل نموذج التسجيل لهذا الحدث',
      accessProgram: 'الوصول إلى البرنامج',
      inactiveEvent: 'حدث غير نشط',
      inactiveEventDesc: 'هذا الحدث غير نشط في الوقت الحالي',
      inactive: 'غير نشط',
      registered: 'مسجل',
      firstName: 'الاسم الأول *',
      firstNamePlaceholder: 'اسمك الأول',
      lastName: 'اسم العائلة *',
      lastNamePlaceholder: 'اسم عائلتك',
      email: 'البريد الإلكتروني *',
      emailPlaceholder: 'بريدك@الإلكتروني.com',
      position: 'المنصب',
      positionPlaceholder: 'منصبك',
      company: 'المنظمة',
      companyPlaceholder: 'منظمتك',
      consentLabel: 'أوافق على تلقي اتصالات متعلقة بهذا الحدث',
      consentHint: 'يمكنك إلغاء الاشتراك في أي وقت',
      registerButton: 'تسجيل',
      registering: 'جاري التسجيل...'
    },
    language: {
      select: 'اختر لغتك',
      french: 'الفرنسية',
      english: 'الإنجليزية',
      portuguese: 'البرتغالية',
      spanish: 'الإسبانية'
    },
    program: {
      title: 'البرنامج',
      welcome: 'مرحبًا بك في برنامج الحدث',
      currentTime: 'الوقت الحالي',
      eventTitle: 'عنوان الحدث',
      activity: 'النشاط',
      speaker: 'المتحدث',
      location: 'الموقع',
      conference: 'مؤتمر',
      workshop: 'ورشة عمل',
      networking: 'التواصل',
      break: 'استراحة',
      ceremony: 'حفل',
      other: 'أخرى',
      logout: 'تسجيل الخروج',
      copyright: '© 2025 ANSUT. جميع الحقوق محفوظة.'
    }
  }
};