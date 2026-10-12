import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COURSES = ['Starter', 'Main Course', 'Dessert'];
const COLORS = {
  ink: '#25213A', muted: '#777487', plum: '#6846A5', plumDark: '#523485',
  lilac: '#F0EAF8', canvas: '#F8F6FA', white: '#FFFFFF', line: '#E9E5EF',
  green: '#2E7D5B', greenBg: '#E8F5EE', red: '#B4233D', redBg: '#FFF0F2',
};

function FieldLabel({ children, required }) {
  return <Text style={styles.label}>{children}{required ? <Text style={styles.required}> *</Text> : null}</Text>;
}

function MenuCard({ item }) {
  return (
    <View style={styles.menuCard}>
      <View style={styles.cardTop}>
        <View style={styles.dishCopy}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishDescription} numberOfLines={3}>{item.description}</Text>
        </View>
        <Text style={styles.price}>R {Number(item.price).toFixed(2)}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.coursePill}><Text style={styles.courseText}>{item.course}</Text></View>
      </View>
    </View>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [courseOpen, setCourseOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const sortedItems = useMemo(() => items, [items]);

  function resetForm() {
    setName(''); setDescription(''); setCourse(''); setPrice(''); setErrors({}); setCourseOpen(false);
  }

  function openForm() {
    setNotice(''); resetForm(); setFormOpen(true);
  }

  function closeForm() {
    Keyboard.dismiss(); setFormOpen(false); setCourseOpen(false);
  }

  function addMenuItem() {
    Keyboard.dismiss();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Enter the dish name.';
    if (!description.trim()) nextErrors.description = 'Enter a short description.';
    if (!course) nextErrors.course = 'Choose a course.';
    if (!price.trim()) nextErrors.price = 'Enter the price.';
    else if (!/^\d+(\.\d{1,2})?$/.test(price.trim()) || Number(price) <= 0) nextErrors.price = 'Enter a price greater than R 0.00 (up to 2 decimal places).';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setItems(current => [{
      id: `${Date.now()}-${Math.random()}`,
      name: name.trim(), description: description.trim(), course, price: Number(price).toFixed(2),
    }, ...current]);
    setFormOpen(false);
    resetForm();
    setNotice(`${name.trim()} was added to the menu.`);
  }

  function renderItem({ item }) { return <MenuCard item={item} />; }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.canvas} />
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>CM</Text></View>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>CHEF'S TOOLKIT</Text>
            <Text style={styles.appTitle}>Menu Manager</Text>
          </View>
          <View style={styles.countBadge}><Text style={styles.countNumber}>{items.length}</Text><Text style={styles.countCaption}>items</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>YOUR KITCHEN, ORGANIZED</Text>
          <Text style={styles.heroTitle}>Build a menu{ '\n' }worth sharing.</Text>
          <Text style={styles.heroSubtitle}>Add your dishes and keep every course in one place.</Text>
          <Pressable accessibilityRole="button" onPress={openForm} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.plus}>＋</Text><Text style={styles.primaryButtonText}>Add a menu item</Text>
          </Pressable>
        </View>

        <View style={styles.listHeading}>
          <View><Text style={styles.sectionTitle}>Your menu</Text><Text style={styles.sectionSubtitle}>{items.length === 1 ? '1 dish added' : `${items.length} dishes added`}</Text></View>
          {items.length > 0 ? <Pressable accessibilityRole="button" onPress={openForm} hitSlop={8}><Text style={styles.addAnother}>＋ Add new</Text></Pressable> : null}
        </View>

        {notice ? <View accessibilityRole="alert" style={styles.successNotice}><Text style={styles.successIcon}>✓</Text><Text style={styles.successText}>{notice}</Text><Pressable onPress={() => setNotice('')} hitSlop={8}><Text style={styles.dismiss}>×</Text></Pressable></View> : null}

        <FlatList
          data={sortedItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContent, items.length === 0 && styles.emptyListContent]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyIllustration}><Text style={styles.emptyEmoji}>✦</Text></View>
              <Text style={styles.emptyTitle}>Your menu starts here</Text>
              <Text style={styles.emptyBody}>No dishes yet. Add your first menu item to see it appear here.</Text>
              <Pressable accessibilityRole="button" onPress={openForm} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Add your first dish</Text></Pressable>
            </View>
          }
        />

        <Modal visible={formOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeForm}>
          <SafeAreaView style={styles.modalSafe}>
            <KeyboardAvoidingView style={styles.modalSafe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.modalHeader}>
                <Pressable accessibilityRole="button" onPress={closeForm} style={styles.closeButton}><Text style={styles.closeButtonText}>×</Text></Pressable>
                <Text style={styles.modalTitle}>New menu item</Text>
                <View style={styles.closeSpacer} />
              </View>
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formContent}>
                <Text style={styles.formIntro}>Add the details for your next dish.</Text>

                <FieldLabel required>Dish name</FieldLabel>
                <TextInput
                  accessibilityLabel="Dish name"
                  style={[styles.input, errors.name && styles.inputError]}
                  value={name} onChangeText={value => { setName(value); if (errors.name) setErrors(current => ({ ...current, name: undefined })); }}
                  placeholder="e.g. Roasted tomato soup" placeholderTextColor="#A5A1AF" returnKeyType="next" maxLength={60}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                <FieldLabel required>Description</FieldLabel>
                <TextInput
                  accessibilityLabel="Description"
                  style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
                  value={description} onChangeText={value => { setDescription(value); if (errors.description) setErrors(current => ({ ...current, description: undefined })); }}
                  placeholder="Describe the dish and what makes it special" placeholderTextColor="#A5A1AF" multiline textAlignVertical="top" maxLength={180}
                />
                {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

                <FieldLabel required>Course</FieldLabel>
                <Pressable accessibilityRole="button" accessibilityLabel="Choose course" accessibilityState={{ expanded: courseOpen }} onPress={() => setCourseOpen(value => !value)} style={[styles.input, styles.courseSelector, errors.course && styles.inputError]}>
                  <Text style={course ? styles.selectorValue : styles.placeholder}>{course || 'Select a course'}</Text><Text style={styles.chevron}>{courseOpen ? '⌃' : '⌄'}</Text>
                </Pressable>
                {courseOpen ? <View style={styles.courseOptions}>{COURSES.map(option => <Pressable key={option} accessibilityRole="button" onPress={() => { setCourse(option); setCourseOpen(false); if (errors.course) setErrors(current => ({ ...current, course: undefined })); }} style={styles.courseOption}><Text style={[styles.courseOptionText, option === course && styles.courseOptionSelected]}>{option}</Text>{option === course ? <Text style={styles.selectedCheck}>✓</Text> : null}</Pressable>)}</View> : null}
                {errors.course ? <Text style={styles.errorText}>{errors.course}</Text> : null}

                <FieldLabel required>Price</FieldLabel>
                <View style={[styles.priceInputWrap, errors.price && styles.inputError]}>
                  <Text style={styles.currencyPrefix}>R</Text>
                  <TextInput
                    accessibilityLabel="Price in South African rand"
                    style={styles.priceInput}
                    value={price} onChangeText={value => { setPrice(value.replace(/[^0-9.]/g, '')); if (errors.price) setErrors(current => ({ ...current, price: undefined })); }}
                    placeholder="0.00" placeholderTextColor="#A5A1AF" keyboardType="decimal-pad" returnKeyType="done" onSubmitEditing={addMenuItem}
                  />
                </View>
                {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

                <Pressable accessibilityRole="button" onPress={addMenuItem} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                  <Text style={styles.submitButtonText}>Add to menu</Text><Text style={styles.submitArrow}>→</Text>
                </Pressable>
                <Text style={styles.requiredHint}>Fields marked * are required.</Text>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.canvas },
  screen: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 18 },
  brandMark: { width: 44, height: 44, borderRadius: 15, backgroundColor: COLORS.plum, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: COLORS.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  headerCopy: { flex: 1, marginLeft: 12 }, eyebrow: { color: COLORS.plum, fontSize: 9, fontWeight: '800', letterSpacing: 1.7 },
  appTitle: { color: COLORS.ink, fontSize: 19, fontWeight: '800', marginTop: 2 },
  countBadge: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', flexDirection: 'row', gap: 5 },
  countNumber: { color: COLORS.plum, fontWeight: '800', fontSize: 14 }, countCaption: { color: COLORS.muted, fontSize: 11, fontWeight: '600' },
  hero: { backgroundColor: COLORS.plum, borderRadius: 24, padding: 22, marginBottom: 26, overflow: 'hidden' },
  heroEyebrow: { color: '#E3D8F2', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 }, heroTitle: { color: COLORS.white, fontSize: 27, lineHeight: 32, fontWeight: '800', marginTop: 10 },
  heroSubtitle: { color: '#EEE8F6', fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 265 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: COLORS.white, borderRadius: 13, paddingHorizontal: 15, height: 44, marginTop: 17, gap: 7 },
  plus: { color: COLORS.plum, fontSize: 20, fontWeight: '500', marginTop: -2 }, primaryButtonText: { color: COLORS.plumDark, fontSize: 13, fontWeight: '800' }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  listHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, sectionTitle: { color: COLORS.ink, fontSize: 20, fontWeight: '800' }, sectionSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 3 },
  addAnother: { color: COLORS.plum, fontWeight: '800', fontSize: 12 },
  listContent: { paddingBottom: 22, gap: 12 }, emptyListContent: { flexGrow: 1 },
  menuCard: { backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 16, shadowColor: '#32264B', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, dishCopy: { flex: 1 }, dishName: { color: COLORS.ink, fontSize: 16, fontWeight: '800' }, dishDescription: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  price: { color: COLORS.plumDark, fontSize: 14, fontWeight: '800' }, cardFooter: { flexDirection: 'row', marginTop: 12 }, coursePill: { backgroundColor: COLORS.lilac, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }, courseText: { color: COLORS.plumDark, fontSize: 10, fontWeight: '800' },
  successNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.greenBg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, gap: 8 }, successIcon: { color: COLORS.green, fontSize: 15, fontWeight: '900' }, successText: { flex: 1, color: COLORS.green, fontSize: 12, fontWeight: '700' }, dismiss: { color: COLORS.green, fontSize: 20, lineHeight: 22 },
  emptyCard: { flex: 1, minHeight: 210, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, paddingHorizontal: 25, paddingVertical: 24 },
  emptyIllustration: { width: 52, height: 52, borderRadius: 18, backgroundColor: COLORS.lilac, alignItems: 'center', justifyContent: 'center', marginBottom: 13 }, emptyEmoji: { color: COLORS.plum, fontSize: 25, fontWeight: '800' }, emptyTitle: { color: COLORS.ink, fontSize: 17, fontWeight: '800' }, emptyBody: { color: COLORS.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7, maxWidth: 250 },
  secondaryButton: { backgroundColor: COLORS.lilac, borderRadius: 11, paddingHorizontal: 16, paddingVertical: 11, marginTop: 16 }, secondaryButtonText: { color: COLORS.plumDark, fontSize: 12, fontWeight: '800' },
  modalSafe: { flex: 1, backgroundColor: COLORS.canvas }, modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  closeButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }, closeButtonText: { color: COLORS.ink, fontSize: 24, lineHeight: 27 }, modalTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '800' }, closeSpacer: { width: 34 },
  formContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 36 }, formIntro: { color: COLORS.muted, fontSize: 13, marginBottom: 22 },
  label: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 15 }, required: { color: COLORS.plum },
  input: { minHeight: 48, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, backgroundColor: COLORS.white, paddingHorizontal: 14, color: COLORS.ink, fontSize: 13 }, inputError: { borderColor: COLORS.red },
  descriptionInput: { height: 92, paddingTop: 13 }, errorText: { color: COLORS.red, fontSize: 11, marginTop: 6, lineHeight: 15 },
  courseSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, selectorValue: { color: COLORS.ink, fontSize: 13 }, placeholder: { color: '#A5A1AF', fontSize: 13 }, chevron: { color: COLORS.muted, fontSize: 18 },
  courseOptions: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, marginTop: 7, overflow: 'hidden' }, courseOption: { minHeight: 45, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.line }, courseOptionText: { color: COLORS.ink, fontSize: 13 }, courseOptionSelected: { color: COLORS.plum, fontWeight: '800' }, selectedCheck: { color: COLORS.plum, fontWeight: '900' },
  priceInputWrap: { minHeight: 48, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, currencyPrefix: { color: COLORS.plumDark, fontSize: 14, fontWeight: '800', marginRight: 10 }, priceInput: { flex: 1, color: COLORS.ink, fontSize: 13, paddingVertical: 10 },
  submitButton: { minHeight: 50, backgroundColor: COLORS.plum, borderRadius: 14, marginTop: 26, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, submitButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '800' }, submitArrow: { color: COLORS.white, fontSize: 19 }, requiredHint: { color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 12 },
});

